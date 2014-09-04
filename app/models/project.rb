class Project < ActiveRecord::Base
  acts_as_url :title, sync_url: true

  belongs_to :user

  has_many :footnotes, dependent: :destroy

  validates_associated :footnote_list

  validates :title, presence: true
  validates :content, presence: true

  before_save :save_footnotes

  def as_json(options = { })
    h = super(options)
    h[:raw_content] = raw_content
    h[:footnotes] = footnotes
    h
  end

  def raw_content=(content)
    content = footnotes_from_markdown(content)
    content = captioned_images_from_markdown(content)

    write_attribute(:content, content)
  end

  def raw_content
    raw_content = read_attribute(:content)

    if raw_content
      raw_content = markdown_from_footnotes(raw_content)
      raw_content = markdown_from_captioned_images(raw_content)
    end

    return raw_content
  end

  def to_param
    # Overwritten to provide slugs (using the title) rather than numeric references
    url
  end

  def footnote_list
    if caller[0][/`([^']*)'/, 1] == 'block in validate'
      @footnote_list
    else
      (@footnote_list ||= footnotes).map(&:content)
    end
  end

  def belongs_to?(current_user)
    self.user == current_user
  end

  private

    def save_footnotes
      self.footnotes = []
      unless @footnote_list.empty?
        self.footnotes = Footnote.transaction do
          @footnote_list.each(&:save)
        end
      end
    end

    def footnotes_from_markdown(markdown)
      # Convert markdown signifying footnotes into Footnote objects and insert referential html in its place.
      count = 1
      @footnote_list = []
      footnote = /(\[\[([\s\S][^\r\n]*?)\]\])/
      return markdown.gsub(footnote) do |_|
        # TODO: Make these contain anchor links to the related footnote's id so that a user can click them to go to a footnote.
        r = "<sup class='footnote-pointer' data-references='#note-#{count}'>#{count}</sup>"
        @footnote_list << Footnote.new(content: $2)
        count += 1
        r
      end
    end

    def captioned_images_from_markdown(markdown)
      # Insert figure html for markdown signifying captioned images.
      #   Format: &[alt(1)](image_source(2) title(4)(5))[caption_text(6)] # TODO: Make this better. Less captures.
      captioned_image = /&\[([^\n\]]*)\]\(([^\n\]]*)? ('([^\n\]]*)'|"([^\n\]]*)")\)\[([^\n\]]*)\]/
      return markdown.gsub(captioned_image) do |_|
        title = $4 || $5

        "<figure><img src='#{$2}' alt='#{$1}' title='#{title}'><figcaption>#{$6}</figcaption></figure>"
      end
    end

    def markdown_from_footnotes(html)
      # Insert markdown for footnote html.
      count = 0
      current_footnotes = footnote_list
      footnote_html = /(<sup class='footnote-pointer' data-references='#note-(\d)'>([\s\S][^\r\n]*?)<\/sup>)/
      return html.gsub(footnote_html) do |s|
        f = "[[#{current_footnotes[count]}]]"
        count += 1
        f
      end
    end

    def markdown_from_captioned_images(html)
      # Insert markdown for captioned images html.
      captioned_image_html = /<figure><img src='([^\n\]]*)' alt='([^\n\]]*)' title='([^\n\]]*)'><figcaption>([^\n\]]*)<\/figcaption><\/figure>/
      return html.gsub(captioned_image_html) do |s|
        "&[#{$2}](#{$1} '#{$3}')[#{$4}]"
      end
    end
end
