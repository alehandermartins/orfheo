class User

  def initialize user
    @user = new_user user
  end

  def [] key
    @user[key]
  end

  def to_h
    @user.to_h
  end

  private
  def new_user user
    {
      user_id: SecureRandom.uuid,
      email: user[:email],
      password: user[:password],
      lang: user[:lang],
      validation: false,
      validation_code: SecureRandom.uuid
    }
  end
end
