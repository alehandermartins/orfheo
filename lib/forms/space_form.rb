class SpaceForm
  class << self

    def fields
      [
        {
          name: 'responsible',
          type: 'mandatory',
          category: 'all'
        },
        {
          name: 'phone',
          type: 'mandatory',
          category: 'all'
        },
        {
          name: 'description',
          type: 'mandatory',
          category: 'all'
        },
        {
          name: 'availability',
          type: 'mandatory',
          category: 'all'
        },
        {
          name: 'links',
          type: 'optional',
          category: 'all'
        },
        {
          name: 'own',
          type: 'optional',
          category: 'all'
        },
        {
          name: 'sharing',
          type: 'optional',
          category: 'all'
        },
        {
          name: 'un_wanted',
          type: 'optional',
          category: 'all'
        }
      ]
    end

    def categories
      [
        'other'
      ]
    end
  end
end
