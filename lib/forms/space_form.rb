class SpaceForm
  class << self

    def fields
      [
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
        }
      ]
    end
  end
end
