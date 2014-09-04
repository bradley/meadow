class Api::SessionsController < Api::ApiController
  before_action :require_logout, only: [:create]

  def create
    safe_params = clean_params(user_params) if user_params

    if safe_params && @user = login(safe_params['username'], safe_params['password'])
      render status: 200, json: {
        username: @user.username,
        access_token: create_token(@user.slice(*[:username, :id])),
        id: @user.id
      }
    else
      render status: 422, json: { error: "Incorrect username or password."}
    end
  end

  def authenticate_token
    render status: 200, json: { logged_in: current_user ? true : false }
  end

  def destroy
    logout
    render status: 200, json: { success: "You have logged out." }
  end

  private

    def user_params
      params.require(:user).permit(
        :username, :password
      )
    end

    def create_token(user)
      secret = ENV['JWT_SECRET']
      JWT.encode(user, secret)
    end
end
