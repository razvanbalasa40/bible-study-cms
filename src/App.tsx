import { useCallback } from "react";

import { User as FirebaseUser } from "firebase/auth";
import {
    Authenticator,
    buildCollection,
    buildProperty,
    EntityReference,
    FirebaseCMSApp
} from "firecms";

import "typeface-rubik";
import "@fontsource/ibm-plex-mono";

// TODO: Replace with your config
const firebaseConfig = {
  apiKey: "AIzaSyD-ye1-ge1FfKwuCeiI_lBpxyfqPNW6O9k",
  authDomain: "genericchatapp-4d046.firebaseapp.com",
  projectId: "genericchatapp-4d046",
  storageBucket: "genericchatapp-4d046.appspot.com",
  messagingSenderId: "842951490492",
  appId: "1:842951490492:web:81c7514bc61539892b89b9",
  measurementId: "G-4KHY133PR5"
};

// const locales = {
//     "en-US": "English (United States)",
//     "es-ES": "Spanish (Spain)",
//     "de-DE": "German"
// };

// type Product = {
//     name: string;
//     price: number;
//     status: string;
//     published: boolean;
//     related_products: EntityReference[];
//     main_image: string;
//     tags: string[];
//     description: string;
//     categories: string[];
//     publisher: {
//         name: string;
//         external_id: string;
//     },
//     expires_on: Date
// }

type BlogPost = {
  title: string;
  author: {
    name: string;
    url: string;
  };
  slug: string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  relatedPosts: EntityReference[];

  postedOn: Date;
  lastUpdated: Date;

  topImage: string;
  content: string;
};

type BlogPostParagraph = {
  title: string;
  content: string;
  order: number;
  subparagraphs: {
    title: string;
    content: string;
  }[];
};

// const localeCollection = buildCollection({
//     path: "locale",
//     customId: locales,
//     name: "Locales",
//     singularName: "Locales",
//     properties: {
//         name: {
//             name: "Title",
//             validation: { required: true },
//             dataType: "string"
//         },
//         selectable: {
//             name: "Selectable",
//             description: "Is this locale selectable",
//             dataType: "boolean"
//         },
//         video: {
//             name: "Video",
//             dataType: "string",
//             validation: { required: false },
//             storage: {
//                 storagePath: "videos",
//                 acceptedFiles: ["video/*"]
//             }
//         }
//     }
// });

const blogPostsParagraphs = buildCollection<BlogPostParagraph>({
  name: 'Paragraphs',
  singularName: 'Paragraph',
  path: 'paragraphs',
  properties: {
    title: {
      name: 'Title',
      validation: { required: true },
      dataType: 'string',
    },
    content: {
      name: 'Content',
      markdown: true,
      validation: { required: true },
      dataType: 'string',
    },
    order: {
      name: 'Order',
      validation: { required: true },
      dataType: 'number',
    },
    subparagraphs: {
      name: 'Subparagraphs',
      dataType: 'array',
      of: {
        dataType: 'map',
        properties: {
          title: {
            name: 'Title',
            validation: { required: true },
            dataType: 'string',
          },
          content: {
            name: 'Content',
            markdown: true,
            validation: { required: true },
            dataType: 'string',
          },
        },
      },
    },
  },
});

const blogPostsCollection = buildCollection<BlogPost>({
  name: 'BlogPosts',
  singularName: 'BlogPost',
  path: 'blog-posts',
  icon: 'Article',
  // permissions: ({ authController }) => ({
  //   edit: true,
  //   create: true,
  //   // we have created the roles object in the navigation builder
  //   delete: false
  // }),
  subcollections: [blogPostsParagraphs],
  properties: {
    title: {
      name: 'Title',
      validation: { required: true },
      dataType: 'string',
    },
    metaTitle: {
      name: 'Meta title',
      validation: { required: true },
      dataType: 'string',
    },
    metaDescription: {
      name: 'Meta description',
      multiline: true,
      validation: { required: true },
      dataType: 'string',
    },
    slug: {
      name: 'Slug',
      validation: { required: true },
      dataType: 'string',
    },
    author: {
      name: 'Author',
      validation: { required: true },
      dataType: 'map',
      properties: {
        name: {
          name: 'Name',
          validation: { required: true },
          dataType: 'string',
        },
        url: {
          name: 'Url',
          validation: { required: true },
          dataType: 'string',
        },
      },
    },
    tags: {
      name: 'Tags',
      dataType: 'array',
      of: {
        dataType: 'string',
      },
    },
    relatedPosts: {
      dataType: 'array',
      name: 'Related posts',
      of: {
        dataType: 'reference',
        path: 'blog-posts',
      },
    },
    topImage: buildProperty({
      name: 'Top image',
      dataType: 'string',
      storage: {
        storagePath: 'blog-posts/images',
        acceptedFiles: ['image/*'],
        fileName: (context) => {
          return context.file.name;
        },
      },
    }),
    content: {
      name: 'Content',
      markdown: true,
      validation: { required: true },
      dataType: 'string',
    },
    postedOn: buildProperty({
      name: 'Posted on',
      dataType: 'date',
      autoValue: 'on_create',
      validation: { required: true },
    }),
    lastUpdated: buildProperty({
      name: 'Updated on',
      dataType: 'date',
      autoValue: 'on_update',
      validation: { required: true },
    }),
  },
});

export default function App() {
  const myAuthenticator: Authenticator<FirebaseUser> = useCallback(
    async ({ user, authController }) => {
      console.log('Allowing access to', user?.email);
      // This is an example of retrieving async data related to the user
      // and storing it in the user extra field.
      const sampleUserRoles = await Promise.resolve(['admin']);
      authController.setExtra(sampleUserRoles);

      return true;
    },
    []
  );

  return (
    <FirebaseCMSApp
      name={'Bible chat CMS'}
      authentication={myAuthenticator}
      collections={[blogPostsCollection]}
      firebaseConfig={firebaseConfig}
    />
  );
}