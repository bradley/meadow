class Api::ApiController < ActionController::Base
  def clean_params(dirty_params)
    # Clean params including nested params.
    clean_params ||= {}
    dirty_params.each do |k, v|
      clean_params[k] = v.is_a?(Hash) ? clean_params(v) : clean_value(v)
    end
    return clean_params
  end

  def clean_value(val)
    HTMLEntities.new.decode(
      Sanitize.clean(val, Sanitize::Config::RESTRICTED))
  end

  def current_user
    @current_user ||= begin
      secret = ENV['JWT_SECRET']
      token = request.headers['Authorization'].split(' ').last
      decoded = JWT.decode(token, secret)
      User.find_by_id(decoded['id'])
    rescue
       nil
    end
  end

  def validate_token
    begin
      secret = ENV['JWT_SECRET']
      token = request.headers['Authorization'].split(' ').last
      JWT.decode(token, secret)
    rescue# JWT::DecodeError
      head :unauthorized
    end
  end

  def require_logout
    if current_user
      render status: 401, json: { error: "You are already logged in." }
    end
  end

  def not_found
    render status: 404, json: { error: "Not Found." }
  end
end
