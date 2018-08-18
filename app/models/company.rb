class Company < ApplicationRecord
  has_many :user_companies
  has_many :users, through: :user_companies
  validates :name, presence: true
  validates :symbol, presence: true
end
