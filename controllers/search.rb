class SearchController < BaseController

  post '/suggest' do
    last = params[:query].pop
    results = check_categories last
    success({items: results})
  end

  private
  def check_categories last
    categories.map.with_index{ |category, index|
      {id: index, text: category} if category.include? last
    }.compact
  end

  def categories
    [ 
      'artista',
      'espacio',
      'asociacion cultural',
      'espacio particular',
      'local comercial',
      'musica',
      'artes escenicas',
      'exposicion',
      'poesia',
      'street art',
      'taller'
    ]
  end
end
