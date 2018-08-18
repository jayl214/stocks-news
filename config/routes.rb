Rails.application.routes.draw do

  namespace :api do
    namespace :v1 do
      resources :companies
      resources :users
      post 'auth/register', to: 'users#register'
    end
  end

end
