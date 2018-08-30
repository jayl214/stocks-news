module Api::V1
  class UsersController < ApplicationController
    skip_before_action :authenticate_request, only: %i[login register]


    # GET /users
    # def index
    #   @users = User.all

    #   render json: @users
    # end

    # GET /users/1
    # def show
    #   render json: @user
    # end

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

    # Check what params does exactly
    def add_company (symbol, name)
      # @newCompany = Company.create(:name params[:product_id], :email params[email])
      # company(symbol, name) exists?{
      #   if NOT: create it
      # }
      # user add company
    end

    # PATCH/PUT /users/1
    # def update
    #   if @user.update(user_params)
    #     render json: @user
    #   else
    #     render json: @user.errors, status: :unprocessable_entity
    #   end
    # end

    # DELETE /users/1
    # def destroy
    #   @user.destroy
    # end

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