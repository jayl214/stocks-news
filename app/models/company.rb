class Company < ApplicationRecord
  has_many :user_companies
  has_many :users, through: :user_companies, :uniq true
  validates :name, presence: true, uniqueness: true
  validates :symbol, presence: true, uniqueness: true

end
