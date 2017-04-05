class FormsController < BaseController

  post '/' do
  	scopify :call_id, :lang
    check_call_exists! call_id
    forms = Repos::Calls.get_forms call_id, lang
    success({forms: forms})
  end

  private
  def check_call_exists! call_id
    raise Pard::Invalid::UnexistingCall unless Repos::Calls.exists? call_id
  end
end
