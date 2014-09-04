class Footnote < ActiveRecord::Base
  belongs_to :project

  validates :content, length: { maximum: 500 }
end
