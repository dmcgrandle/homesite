import { PhotoAlbumList } from './photo-classes';

export const ROOT_ALBUMLIST: PhotoAlbumList = {
  name: 'All Photo Albums',
  description: 'Contains all Photo Albums in this share site',
  dir: 'images',
  featuredPhoto: {
    filename: 'protected/images/2018-06-03Graduation0364.jpg',
    caption: 'Nice picture of Rachel.'
  },
  contains: [
    { name : 'Darren Photos',
      description : 'Photos of Darren',
      dir: 'Darren',
      featuredPhoto : {
        filename: 'protected/images/Darren/2012-08-21_Easter_2775.jpg',
        caption: 'Darren taking pics at the beach.'
      },
      photos: [
        { filename: 'protected/images/Darren/20040217-cat.jpg',
          caption: 'Darren with Lady'
        },
        { filename: 'protected/images/Darren/20050430-daddy.jpg',
          caption: 'Darren with Rachel'
        },
        { filename: 'protected/images/Darren/20060413-driving.jpg',
          caption: 'Darren driving'
        },
        { filename: 'protected/images/Darren/20071225-train.jpg',
          caption: 'Darren with train set for Christmas'
        },
        { filename: 'protected/images/Darren/20100819-IMG_0222.jpg',
          caption: 'Darren Rowing'
        },
        { filename: 'protected/images/Darren/20100820-IMG_0249.jpg',
          caption: 'Darren outside old school'
        },
        { filename: 'protected/images/Darren/20101225-_MG_0643.jpg',
          caption: 'Darren learning Photography'
        },
        { filename: 'protected/images/Darren/2012-08-21_Easter_2775.jpg',
          caption: 'Darren taking pics at the beach.'
        },
        { filename: 'protected/images/Darren/2013-12-01_Deacons_0535.jpg',
          caption: "Darren's deacon pic."
        }
      ]
    },
    { name : 'Vacation Photos',
      description : 'Vacation Photo Albums',
      dir: 'Vacations',
      featuredPhoto : {
        filename: 'protected/images/Vacations/15th_Anniversary/2018-04-03_15thAnniversary_4011.jpg',
        caption: 'View from balcony.'
      },
      contains: [
        { name : '15th Anniversary Photos',
          description : 'Photos of our 15th Anniversary at Muir Beach, CA',
          dir: '15th_Anniversary',
          featuredPhoto : {
            filename: 'protected/images/2018-05-23PianoRecital0356.jpg',
            caption: 'View from balcony.'
          },
          photos: [
            { filename: 'protected/images/Darren/20040217-cat.jpg',
              caption: 'Darren with Lady'
            }
          ]
        },
        { name : 'Honeymoon',
          description : 'Photos of our honeymoon in Ferndale, CA',
          dir: 'Honeymoon',
          featuredPhoto : {
            filename: 'protected/images/2018-05-23PianoRecital0356.jpg',
            caption: 'The Shaw House.'
          },
          photos: [
            { filename: 'protected/images/Darren/20040217-cat.jpg',
              caption: 'Darren with Lady'
            }
          ]
        }
      ]
    },
    { name : 'Test 1',
      description : 'Test Photo Album 1',
      dir: 'test1',
      featuredPhoto : {
        filename: 'protected/images/Darren/20050430-daddy.jpg',
        caption: 'Test 1.'
      },
      photos: [
        { filename: 'protected/images/Darren/2013-12-01_Deacons_0535.jpg',
          caption: "Test Photo 1"
        }
      ]
    },
    { name : 'Test 2',
      description : 'Test Photo Album 2',
      dir: 'test1',
      featuredPhoto : {
        filename: 'protected/images/Darren/20060413-driving.jpg',
        caption: 'Test 2.'
      },
      photos: [
        { filename: 'protected/images/Darren/2013-12-01_Deacons_0535.jpg',
          caption: "Test Photo 3"
        }
      ]
    },
    { name : 'Test 3',
      description : 'Test Photo Album 3',
      dir: 'test1',
      featuredPhoto : {
        filename: 'protected/images/Darren/20071225-train.jpg',
        caption: 'Test 3.'
      },
      photos: [
        { filename: 'protected/images/Darren/2013-12-01_Deacons_0535.jpg',
          caption: "Test Photo 3"
        }
      ]
    },
    { name : 'Test 4',
      description : 'Test Photo Album 4',
      dir: 'test1',
      featuredPhoto : {
        filename: 'protected/images/Darren/20100819-IMG_0222.jpg',
        caption: 'Test 4.'
      },
      photos: [
        { filename: 'protected/images/Darren/2013-12-01_Deacons_0535.jpg',
          caption: "Test Photo 4"
        }
      ]
    },
    { name : 'Test 5',
      description : 'Test Photo Album 5',
      dir: 'test1',
      featuredPhoto : {
        filename: 'protected/images/Darren/20100820-IMG_0249.jpg',
        caption: 'Test 5.'
      },
      photos: [
        { filename: 'protected/images/Darren/2013-12-01_Deacons_0535.jpg',
          caption: "Test Photo 5"
        }
      ]
    },
    { name : 'Test 6',
      description : 'Test Photo Album 6',
      dir: 'test1',
      featuredPhoto : {
        filename: 'protected/images/Darren/20101225-_MG_0643.jpg',
        caption: 'Test 6.'
      },
      photos: [
        { filename: 'protected/images/Darren/2013-12-01_Deacons_0535.jpg',
          caption: "Test Photo 6"
        }
      ]
    },
    { name : 'Test 7',
      description : 'Test Photo Album 7',
      dir: 'test1',
      featuredPhoto : {
        filename: 'protected/images/Darren/2012-08-21_Easter_2775.jpg',
        caption: 'Test 7.'
      },
      photos: [
        { filename: 'protected/images/Darren/2013-12-01_Deacons_0535.jpg',
          caption: "Test Photo 7"
        }
      ]
    },
    { name : 'Test 8',
      description : 'Test Photo Album 8',
      dir: 'test1',
      featuredPhoto : {
        filename: 'protected/images/Darren/2013-12-01_Deacons_0535.jpg',
        caption: 'Test 8.'
      },
      photos: [
        { filename: 'protected/images/Darren/2013-12-01_Deacons_0535.jpg',
          caption: "Test Photo 8"
        }
      ]
    },
    { name : 'Test 9',
      description : 'Test Photo Album 9',
      dir: 'test1',
      featuredPhoto : {
        filename: 'protected/images/Darren/20040217-cat.jpg',
        caption: 'Test 9.'
      },
      photos: [
        { filename: 'protected/images/Darren/2013-12-01_Deacons_0535.jpg',
          caption: "Test Photo 9"
        }
      ]
    },
    { name : 'Test 10',
      description : 'Test Photo Album 10',
      dir: 'test1',
      featuredPhoto : {
        filename: 'protected/images/2018-05-23PianoRecital0356.jpg',
        caption: 'Test 10.'
      },
      photos: [
        { filename: 'protected/images/Darren/2013-12-01_Deacons_0535.jpg',
          caption: "Test Photo 10"
        }
      ]
    },
    { name : 'Test 11',
      description : 'Test Photo Album 11',
      dir: 'test1',
      featuredPhoto : {
        filename: 'protected/images/2018-05-23PianoRecital0356.jpg',
        caption: 'Test 11.'
      },
      photos: [
        { filename: 'protected/images/Darren/2013-12-01_Deacons_0535.jpg',
          caption: "Test Photo 11"
        }
      ]
    },
  ]
}
