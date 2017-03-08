module Repos
  class Events
    class << self

      def for db
        @@events_collection = db['events']
        events = grab({})

        events.each{ |event|
          next if event[:description].blank?
          event[:texts] = {
            'es'=> {
              description: event[:description],
              baseline: event[:baseline],
              form_categories: form_categories(event[:event_id]),
              subcategories: subcategories(event[:event_id])
            }
          }

          ev_subcategories = {
            artist: {
              '1': {
                icon: 'music'
              },
              '2': {
                icon: 'arts'
              },
              '3': {
                icon: 'workshop'
              },
              '4': {
                icon: 'gastronomy'
              },
              '5': {
                icon: 'expo'
              },
              '6': {
                icon: 'street_art'
              },
              '7': {
                icon: 'poetry'
              },
              '8': {
                icon: 'audiovisual'
              },
              '9': {
                icon: 'other'
              }
            },
            space: {
              '1': {
                icon: ''
              },
              '2': {
                icon: ''
              },
              '3': {
                icon: ''
              },
              '4': {
                icon: ''
              }
            }
          }
          target = ["artist", "space", "organization"]
          categories = {
            artist: ['music', 'arts', 'expo', 'poetry', 'audiovisual', 'street_art', 'workshop', 'gastronomy', 'other']
          }
          partners = {sponsors: []}
          partners[:collaborators] = event[:partners]


          artists = event[:artists].map{ |artist|
            artist[:proposals].each{|proposal|
              proposal[:form_category] = proposals_form event[:event_id].to_sym, :artist, proposal[:form_category].to_sym
              proposal[:subcategory] = proposals_sub event[:event_id].to_sym, :artist, proposal[:subcategory].to_sym
            }
            artist
          }
          spaces = event[:spaces].map{ |space|
            space[:form_category] = proposals_form event[:event_id].to_sym, :space, space[:form_category].to_sym
            space[:subcategory] = proposals_sub event[:event_id].to_sym, :space, space[:subcategory].to_sym
            space[:type] = 'space'
            space
          }
          @@events_collection.update_one({event_id: event[:event_id]},{
            "$set": {texts: event[:texts], artists: artists, spaces: spaces, categories: categories, subcategories: ev_subcategories, target: target, partners: partners},
            "$unset": {description: 1, baseline: 1}
          })
        }
      end

      def form_categories event_id
        categories = {
          "a6bc4203-9379-4de0-856a-55e1e5f3fac6": {
            artist: {
              '1': 'Música',
              '2': 'Artes Escénicas',
              '3': 'Taller',
              '4': 'Gastronomía',
              '5': 'Exposición',
              '6': 'Street Art',
              '7': 'Poesía',
              '8': 'Audiovisual',
              '9': 'Otros'
            },
            space: {
              '10': 'Espacio sin actividad programada',
              '11': 'Espacio con actividad programada'
            }
          },
          "a5bc4203-9379-4de0-856a-55e1e5f3fac6": {
            artist: {
              '1': 'Música',
              '2': 'Artes Escénicas',
              '3': 'Taller',
              '4': 'Gastronomía',
              '5': 'Exposición',
              '6': 'Street Art',
              '7': 'Poesía',
              '8': 'Audiovisual',
              '9': 'Otros'
            },
            space: {
              '10': 'Asociación Cultural',
              '11': 'Local Comercial',
              '12': 'Espacio Particular',
              '13': 'Espacio Exterior'
            }
          }
        }
        return categories[event_id.to_sym]
      end

      def subcategories event_id
        categories = {
          "a6bc4203-9379-4de0-856a-55e1e5f3fac6": {
            artist: {
              '1': 'Música',
              '2': 'Artes Escénicas',
              '3': 'Taller',
              '4': 'Gastronomía',
              '5': 'Exposición',
              '6': 'Street Art',
              '7': 'Poesía',
              '8': 'Audiovisual',
              '9': 'Otros'
            },
            space: {
              '1': 'Restauración y Clubs', 
              '2': 'Arte, Cultura y Diseño', 
              '3': 'Espacio Particular', 
              '4': 'Tiendas y Servicios'
            }
          },
          "a5bc4203-9379-4de0-856a-55e1e5f3fac6": {
            artist: {
              '1': 'Música',
              '2': 'Artes Escénicas',
              '3': 'Taller',
              '4': 'Gastronomía',
              '5': 'Exposición',
              '6': 'Street Art',
              '7': 'Poesía',
              '8': 'Audiovisual',
              '9': 'Otros'
            },
            space: {
              '1': 'Asociación Cultural',
              '2': 'Local Comercial',
              '3': 'Espacio Particular',
              '4': 'Espacio Exterior'
            }
          }
        }
        return categories[event_id.to_sym]
      end

      def proposals_form event_id, type, category
        categories = {
          "a6bc4203-9379-4de0-856a-55e1e5f3fac6": {
            artist: {
              'Música': '1',
              'Artes Escénicas': '2',
              'Taller': '3',
              'Gastronomía': '4',
              'Exposición': '5',
              'Street Art': '6',
              'Poesía': '7',
              'Audiovisual': '8',
              'Otros': '9'
            },
            space: {
              'Espacio sin actividad programada': '10',
              'Espacio con actividad programada': '11'
            }
          },
          "a5bc4203-9379-4de0-856a-55e1e5f3fac6": {
            artist: {
              'Música': '1',
              'Artes Escénicas': '2',
              'Taller': '3',
              'Gastronomía': '4',
              'Exposición': '5',
              'Street Art': '6',
              'Poesía': '7',
              'Audiovisual': '8',
              'Otros': '9'
            },
            space: {
              'Asociación Cultural': '10',
              'Local Comercial': '11',
              'Espacio Particular': '12',
              'Espacio Exterior': '13'
            }
          }
        }
        return categories[event_id][type][category] if categories[event_id][type].has_key? category
        category
      end

      def proposals_sub event_id, type, category
        categories = {
          "a6bc4203-9379-4de0-856a-55e1e5f3fac6": {
            artist: {
              'Música': '1',
              'Artes Escénicas': '2',
              'Taller': '3',
              'Gastronomía': '4',
              'Exposición': '5',
              'Street Art': '6',
              'Poesía': '7',
              'Audiovisual': '8',
              'Otros': '9'
            },
            space: {
              'Restauración y Clubs': '1', 
              'Arte, Cultura y Diseño': '2', 
              'Espacio Particular': '3', 
              'Tiendas y Servicios': '4'
            }
          },
          "a5bc4203-9379-4de0-856a-55e1e5f3fac6": {
            artist: {
              'Música': '1',
              'Artes Escénicas': '2',
              'Taller': '3',
              'Gastronomía': '4',
              'Exposición': '5',
              'Street Art': '6',
              'Poesía': '7',
              'Audiovisual': '8',
              'Otros': '9'
            },
            space: {
              'Asociación Cultural': '1',
              'Local Comercial': '2',
              'Espacio Particular': '3',
              'Espacio Exterior': '4'
            }
          }
        }
        return categories[event_id][type][category] if categories[event_id][type].has_key? category
        category
      end

      def exists? event_id
        return false unless UUID.validate(event_id)
        @@events_collection.count(event_id: event_id) > 0
      end

      def add_artist event_id, artist
        if @@events_collection.count(event_id: event_id, "artists.profile_id": artist[:profile_id]) == 0
          @@events_collection.update_one({event_id: event_id},{
            "$push": {artists: artist}
          })
        else
          @@events_collection.update_one({event_id: event_id, "artists.profile_id": artist[:profile_id]},
          {
            "$push": {"artists.$.proposals": artist[:proposals].first}
          },
          {upsert: true})
        end
      end

      def add_space event_id, space
        return if @@events_collection.count(event_id: event_id, "spaces.profile_id": space[:profile_id]) > 0
        @@events_collection.update_one({event_id: event_id},{
          "$push": {spaces: space}
        })
      end

      def modify_artist artist
        event = grab({"artists.proposals.proposal_id": artist[:proposals].first[:proposal_id]}).first
        proposals = event[:artists].detect{|event_artist| event_artist[:profile_id] == artist[:profile_id]}[:proposals]
        modified_proposals = proposals.map{ |proposal|
          proposal = artist[:proposals].first if proposal[:proposal_id] == artist[:proposals].first[:proposal_id]
          proposal
        }
        @@events_collection.update_one({"artists.proposals.proposal_id": artist[:proposals].first[:proposal_id]},
          {
            "$set": {'artists.$.name': artist[:name], 'artists.$.address': artist[:address], 'artists.$.phone': artist[:phone], 'artists.$.email': artist[:email], 'artists.$.proposals': modified_proposals}
          })
        @@events_collection.update_one({event_id: event[:event_id], "spaces.profile_id": artist[:profile_id]},
          {
            "$set": {'spaces.$.name': artist[:name], 'spaces.$.address': artist[:address], 'spaces.$.phone': artist[:phone], 'spaces.$.email': artist[:email]}
          })
      end

      def modify_space space
        @@events_collection.update_one({"spaces.proposal_id": space[:proposal_id]},
          {
            "$set": {"spaces.$": space}
          })
        @@events_collection.update_one({"artists.profile_id": space[:profile_id]},
          {
            "$set": {'artists.$.name': space[:name], 'artists.$.address': space[:address], 'artists.$.phone': space[:phone], 'artists.$.email': space[:email]}
          })
      end

      def update participant
        @@events_collection.update_many({"artists.profile_id": participant[:profile_id]},
          {
            "$set": {'artists.$.name': participant[:name], 'artists.$.address': participant[:address], 'artists.$.phone': participant[:phone]}
          })
        @@events_collection.update_many({"spaces.profile_id": participant[:profile_id]},
          {
            "$set": {'spaces.$.name': participant[:name], 'spaces.$.address': participant[:address], 'spaces.$.phone': participant[:phone], 'spaces.$.category': participant[:category], 'spaces.$.description': participant[:description]}
          })
      end

      def delete_space_proposal proposal_id
        delete_performances proposal_id
        @@events_collection.update_one({"spaces.proposal_id": proposal_id},
          {
            "$pull": {'spaces': {'proposal_id' => proposal_id}}
          })
      end

      def delete_artist_proposal proposal_id
        delete_performances proposal_id
        event = grab({"artists.proposals.proposal_id": proposal_id}).first
        artist = event[:artists].detect{|artist| artist[:proposals].any?{ |proposal| proposal[:proposal_id] == proposal_id}}
        proposals = artist[:proposals]
        proposals.select!{|proposal| proposal[:proposal_id] != proposal_id}
        return delete_artist(event[:event_id], artist[:profile_id]) if proposals.blank?
        @@events_collection.update_one({"artists.proposals.proposal_id": proposal_id},
          {
            "$set": {'artists.$.proposals': proposals}
          })
      end

      def delete_artist event_id, profile_id
        @@events_collection.update_one({event_id: event_id},
          {
            "$pull": {'artists': {'profile_id' => profile_id}}
          })
      end

      def delete_profile profile_id
        @@events_collection.update_many({"artists.profile_id": profile_id},
          {
            "$set": {'artists.$.own': 'true'}
          })
        @@events_collection.update_many({"spaces.profile_id": profile_id},
          {
            "$set": {'spaces.$.own': 'true'}
          })
      end

      def save_program event_id, program
        @@events_collection.update_one({event_id: event_id},{
          "$set": {program: program}
        })
      end

      def delete_performances proposal_id
        @@events_collection.update_one({"$or": [{"artists.proposals.proposal_id": proposal_id},{"spaces.proposal_id": proposal_id}]},
          {
            "$pull": {'program': {"$or": [{'participant_proposal_id'=> proposal_id}, {'host_proposal_id'=> proposal_id}]}}
          }
        )
      end

      def space_order event_id, order
        event = grab({event_id: event_id}).first
        event[:spaces].each{|space| order.push(space[:profile_id]) unless order.include? space[:profile_id]}
        spaces = event[:spaces].sort_by{|space| order.index(space[:profile_id])}
        @@events_collection.update_one({event_id: event_id},{
          "$set": {spaces: spaces}
        })
      end

      def add_whitelist event_id, whitelist
        @@events_collection.update_one({event_id: event_id},{
          "$set": {whitelist: whitelist}
        })
      end

      def publish event_id
        event = grab({event_id: event_id}).first
        @@events_collection.update_one({event_id: event_id},{
          "$set": {published: !event[:published]}
        })
        !event[:published]
      end

      def get_all
        grab({})
      end

      def get_event event_id
        grab({event_id: event_id}).first
      end

      def get_user_events user_id
        grab({user_id: user_id})
      end

      def get_event_owner event_id
        event = grab({event_id: event_id}).first
        event[:user_id]
      end

      private
      def grab query, projection = {}
        results = @@events_collection.find(query) if projection.blank?
        results = @@events_collection.aggregate([{'$match': query}, {'$project': projection}]) unless projection.blank?
        return [] unless results.count > 0

        results.map { |event|
         Util.string_keyed_hash_to_symbolized event
        }
      end
    end
  end
end