module Api::V1
  class UsersController < ApplicationController
    skip_before_action :authenticate_request, only: %i[login register]

     # POST /register
    def register
      @user = User.create(user_params)
     if @user.save
      response = { message: 'User created successfully'}
      render json: response, status: :created
     else
      render json: @user.errors, status: :bad
     end
    end

    def login
      authenticate params[:email], params[:password]
    end

    def test
      puts @current_user.name
      render json: {
        message: 'You have passed authentication and authorization test'
      }
    end

    def show
      response = { name: @current_user.name }
      render json: response
    end

    def add_company (symbol, name)
      # if !Company.find_by(symbol: params[:symbol])
      #   @newCompany = Company.create(:name params[:name], :symbol params[symbol])
      # end
      # user add company
    end

    private
      def user_params
        params.permit(
          :name,
          :email,
          :password
        )
      end
      def authenticate(email, password)
        command = AuthenticateUser.call(email, password)

        if command.success?
          render json: {
            access_token: command.result,
            message: 'Login Successful'
          }
        else
          render json: { error: command.errors }, status: :unauthorized
        end
      end
  end
end