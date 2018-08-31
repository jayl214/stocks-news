class Company < ApplicationRecord
  has_many :user_companies, dependent: :destroy
  has_many :users, -> {distinct}, through: :user_companies
  validates :name, presence: true, uniqueness: true
  validates :symbol, presence: true, uniqueness: true

end
