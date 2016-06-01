class Call

  def initialize params, user_id
    @call = new_call params, user_id
  end

  def [] key
    call[key]
  end

  def to_h
    call.to_h
  end

  private
  attr_reader :call
  def new_call params, user_id
    {
      user_id: user_id,
      call_id: 'b5bc4203-9379-4de0-856a-55e1e5f3fac6',
      start: params[:start],
      deadline: params[:deadline]
    }
  end
end
