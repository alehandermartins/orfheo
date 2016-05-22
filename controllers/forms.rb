class FormsController < BaseController

  post '/' do
  	scopify form: true, type: true
    check_type_and_category type
    check_form form
    retrieved_form = Forms.create(type) if form == 'create'
    retrieved_form = Forms.modify(type) if form == 'modify'
    success({form: retrieved_form})
  end

  private
  def check_form form
    raise Pard::Invalid::Form unless ['create', 'modify'].include? form
  end
end
