UPDATE dashboard_items
SET properties =
      JSON_REMOVE(JSON_SET(properties,
                           '$.layout',
                           JSON_OBJECT(
                               'xl', JSON_OBJECT(
                               'x', JSON_EXTRACT(properties, '$.rect[0]') + 20,
                               'y', JSON_EXTRACT(properties, '$.rect[1]') + 8,
                               'w', JSON_EXTRACT(properties, '$.rect[2]'),
                               'h', JSON_EXTRACT(properties, '$.rect[3]')
                             )
                             )
                    ), '$.rect');
