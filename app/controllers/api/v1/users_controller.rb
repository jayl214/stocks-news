module Api::V1
  class UsersController < ApplicationController
    before_action :set_user, only: [:show, :update, :destroy]

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
  end
end