class User < ActiveRecord::Base
  authenticates_with_sorcery!

  attr_accessor :updating_password

  has_many :projects, dependent: :destroy

  validates :username,
    presence: true,
    length: { in: 1..20 },
    format: { with: /\A[a-zA-Z0-9_]+\z/i,
           message: "Names must have an alphanumeric format!" },
    uniqueness: true

  # TODO: Strengthen password security constraints
  validates :password,
    presence: true,
    length: { in: 6..300 },
    confirmation: true,
    if: :should_validate_password?

  def can_access?(resource)
    resource.accessible_by?(self)
  end

  private

    def should_validate_password?
      updating_password || new_record?
    end

end
