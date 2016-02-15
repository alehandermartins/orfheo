class ArtistForm
  class << self

    def fields
      [
        {
          name: 'title',
          type: 'mandatory',
          category: 'all'
        },
        {
          name: 'description',
          type: 'mandatory',
          category: 'all'
        },
        {
          name: 'short_description',
          type: 'mandatory',
          category: 'all'
        },
        {
          name: 'phone',
          type: 'mandatory',
          category: 'all'
        },
        {
          name: 'conditions',
          type: 'mandatory',
          category: 'all'
        },
        {
          name: 'children',
          type: 'optional',
          category: 'all'
        },
        {
          name: 'links',
          type: 'optional',
          category: 'all'
        },
        {
          name: 'sharing',
          type: 'optional',
          category: 'all'
        },
        {
          name: 'needs',
          type: 'optional',
          category: 'all'
        },
        {
          name: 'waiting_list',
          type: 'optional',
          category: 'all'
        },
        {
          name: 'duration',
          type: 'mandatory',
          category: 'music'
        },
        {
          name: 'availability',
          type: 'mandatory',
          category: 'music'
        },
        {
          name: 'components',
          type: 'mandatory',
          category: 'music'
        },
        {
          name: 'repeat',
          type: 'optional',
          category: 'music'
        },
        {
          name: 'duration',
          type: 'mandatory',
          category: 'arts'
        },
        {
          name: 'availability',
          type: 'mandatory',
          category: 'arts'
        },
        {
          name: 'components',
          type: 'mandatory',
          category: 'arts'
        },
        {
          name: 'repeat',
          type: 'optional',
          category: 'arts'
        },
        {
          name: 'duration',
          type: 'mandatory',
          category: 'other'
        },
        {
          name: 'availability',
          type: 'mandatory',
          category: 'other'
        },
        {
          name: 'components',
          type: 'mandatory',
          category: 'other'
        },
        {
          name: 'repeat',
          type: 'optional',
          category: 'other'
        },
        {
          name: 'availability',
          type: 'mandatory',
          category: 'street_art'
        },
        {
          name: 'availability',
          type: 'mandatory',
          category: 'poetry'
        },
        {
          name: 'duration',
          type: 'mandatory',
          category: 'poetry'
        },
        {
          name: 'repeat',
          type: 'optional',
          category: 'poetry'
        },
        {
          name: 'availability',
          type: 'mandatory',
          category: 'workshop'
        },
        {
          name: 'duration',
          type: 'mandatory',
          category: 'workshop'
        },
        {
          name: 'repeat',
          type: 'optional',
          category: 'workshop'
        },
        {
          name: 'availability',
          type: 'mandatory',
          category: 'audiovisual'
        },
        {
          name: 'duration',
          type: 'mandatory',
          category: 'audiovisual'
        },
        {
          name: 'meters',
          type: 'mandatory',
          category: 'expo'
        }
      ]
    end
  end
end
