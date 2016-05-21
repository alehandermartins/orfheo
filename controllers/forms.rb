class FormsController < BaseController

  post '/' do
    check_type params[:form]
    form = Forms.get(params[:form])
    success({form: form})
  end

  private
  def check_type type
    raise Pard::Invalid::Type unless Forms.list.include? type
  end
end
