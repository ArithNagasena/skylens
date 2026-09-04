-- ===========================================================================
--  Sky Lens — seed the content tables from what the site ships with today
-- ===========================================================================
--  Optional, and safe to skip. Run it after 0001_init.sql if you would rather
--  the admin panel open already populated with the current site content than
--  with three empty screens.
--
--  Every insert is guarded on the table being empty, so re-running this will
--  never duplicate rows or overwrite an edit made in the admin panel.
--
--  The seeded image rows point at files already in `public/images`, with a
--  null `storage_path` — they are site assets, not uploads, so deleting one
--  from the admin panel removes the row and leaves the file alone. Anything
--  uploaded through the panel from here on lives in the `media` bucket.
--
--  Showreel videos are deliberately NOT seeded. The three currently hard-coded
--  in src/content/showreel.ts belong to DJI and a travel channel, and the
--  section they sit in claims the work as Sky Lens's own — see the warning at
--  the top of that file. Add the four real films through /admin/videos.
-- ===========================================================================

-- ------------------------------------------------------------- services ---
--  The nine priced services from src/content/services.ts, plus the four the
--  landing-page grid carried without a price. Those four have a null
--  `starting_price`, which the site renders as "On request" until someone
--  fills it in.

insert into public.services (slug, title, description, starting_price, price_note, icon, tier, sort_order)
select * from (values
  ('aerial-photography',      'Aerial Photography',                       'High-resolution drone stills for brands, property and hospitality.', 25000::numeric,  '',          'Camera',       'core',       10),
  ('cinematic-videography',   'Cinematic Drone Videography',              '4K aerial film for campaigns, hotels and documentaries.',            45000::numeric,  '',          'Clapperboard', 'core',       20),
  ('weddings-events',         'Wedding & Event Droneography',             'Discreet aerial coverage of weddings, receptions and festivals.',    50000::numeric,  '',          'PartyPopper',  'core',       30),
  ('religious-festivals',     'Religious Places & Festivals',             'Respectful aerial coverage of cultural and religious events.',       null::numeric,   '',          'Landmark',     'core',       40),
  ('real-estate-media',       'Real Estate Media',                        'Aerial and ground media for agents, developers and villa owners.',   32000::numeric,  '',          'Building2',    'core',       50),
  ('tourism-hospitality',     'Tourism & Hospitality Media',              'Complete media packages for hotels, resorts and tour operators.',    100000::numeric, '',          'Palmtree',     'core',       60),
  ('commercial-promotional',  'Commercial & Promotional',                 'Dynamic aerial visuals for brands and campaigns.',                   null::numeric,   '',          'Megaphone',    'core',       70),
  ('flower-dropping',         'Flower Dropping & Floral Aerial Services', 'Precision aerial flower drops for weddings and ceremonies.',         100000::numeric, '',          'Flower2',      'core',       80),
  ('heavy-lift',              'Heavy Lift & Flag Hoisting',               'Industrial payload lifting up to 50 kg for flags and equipment.',    null::numeric,   '',          'Flag',         'core',       90),
  ('landscape-environmental', 'Landscape & Environmental',                'Wide captures of natural environments and coastline.',               null::numeric,   '',          'Mountain',     'core',      100),
  ('survey-mapping',          'Survey & Mapping',                         'Centimetre-accurate maps, models and volume measurements.',          50000::numeric,  '',          'Map',          'specialist',110),
  ('construction-progress',   'Construction Monitoring',                  'Monthly aerial records of site progress from fixed waypoints.',      30000::numeric,  'per visit', 'HardHat',      'specialist',120),
  ('asset-inspection',        'Asset Inspection',                         'Close-range visual and thermal inspection, no scaffolding needed.',  35000::numeric,  '',          'ScanSearch',   'specialist',130)
) as s(slug, title, description, starting_price, price_note, icon, tier, sort_order)
where not exists (select 1 from public.services);

-- ---------------------------------------------------------- hero images ---

insert into public.hero_images (url, alt, sort_order)
select * from (values
  ('/images/hero-aerial-sri-lanka.jpg', 'Cinematic drone aerial of the Sri Lanka south coast at golden hour', 10),
  ('/images/event-shoots.jpg',          'Aerial drone shot of a luxury outdoor event in Sri Lanka',           20),
  ('/images/2018-06-07-165309-c-Toh-Gouttenoire-Costa-Rica-wedding-Edit.jpg',
                                        'Aerial photography of a destination wedding ceremony',              30),
  ('/images/5-848x566.jpg',             'Aerial drone perspective over a scenic Sri Lanka location',         40),
  ('/images/dji-banner.jpg',            'Aerial view of Sigiriya rock fortress at sunrise',                  50)
) as h(url, alt, sort_order)
where not exists (select 1 from public.hero_images);

-- ---------------------------------------------------- latest work strip ---

insert into public.latest_work_images (url, alt, sort_order)
select * from (values
  ('/images/dji-banner.jpg',             'Aerial view of Sigiriya rock fortress at sunrise, Central Province', 10),
  ('/images/hero-feed.jpg',              'Aerial view of a south coast bay, beach road and villas',            20),
  ('/images/cinematic-drone-screen.jpg', 'Sky Lens pilot framing a coastal sunset shot on the controller',     30),
  ('/images/drone-mapping-route.jpg',    'Automated survey flight plan over farmland on a ground station',     40)
) as l(url, alt, sort_order)
where not exists (select 1 from public.latest_work_images);
