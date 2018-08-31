class User < ApplicationRecord
  has_many :user_companies, dependent: :destroy
  has_many :companies, -> {distinct}, through: :user_companies

  validates_presence_of :name, :email, :password_digest

  validates_uniqueness_of :email, :case_sensitive => false

  has_secure_password

end
