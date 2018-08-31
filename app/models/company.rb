class Company < ApplicationRecord
  has_many :user_companies
  has_many :users, -> {distinct}, through: :user_companies
  validates :name, presence: true, uniqueness: true
  validates :symbol, presence: true, uniqueness: true

end
