class User

  def initialize user
    @user = new_user user[:email], user[:password]
  end

  def [] key
    @user[key]
  end

  def to_h
    @user.to_h
  end

  private
  def new_user email, password
    {
      user_id: SecureRandom.uuid,
      email: email,
      password: password,
      validation: false,
      validation_code: SecureRandom.uuid
    }
  end
end
