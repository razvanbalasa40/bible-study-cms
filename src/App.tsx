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
  relatedPosts: EntityReference[];
  
  topImage: string;
  boldContent: string;
  content: string;
};

type BlogPostParagraph = {
  title: string;
  content: string;
  subparagraphs: {
    title: string;
    content: string;
  }[]
}

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
  name: "Paragraphs",
  singularName: "Paragraph",
  path: "paragraphs",
  properties: {
    title: {
      name: "Title",
      validation: { required: true },
      dataType: "string"
    },
    content: {
      name: "Content",
      validation: { required: true },
      dataType: "string"
    },
    subparagraphs: {
      name: "Subparagraphs",
      dataType: "array",
      of: {
        dataType: "map",
        properties: {
          title: {
            name: "Title",
            validation: { required: true },
            dataType: "string"
          },
          content: {
            name: "Content",
            validation: { required: true },
            dataType: "string"
          }
        }
      }
    }
  }
});

const blogPostsCollection = buildCollection<BlogPost>({
  name: "BlogPosts",
  singularName: "BlogPost",
  path: "blog-posts",
  icon: "Article",
  // permissions: ({ authController }) => ({
  //   edit: true,
  //   create: true,
  //   // we have created the roles object in the navigation builder
  //   delete: false
  // }),
  subcollections: [
    blogPostsParagraphs
  ],
  properties: {
    title: {
      name: "Title",
      validation: { required: true },
      dataType: "string"
    },
    author: {
      name: "Author",
      validation: { required: true },
      dataType: "map",
      properties: {
        name: {
          name: "Name",
          validation: { required: true },
          dataType: "string"
        },
        url: {
          name: "Url",
          validation: { required: true },
          dataType: "string"
        },
      },
    },
    slug: {
      name: "Slug",
      validation: { required: true },
      dataType: "string"
    },
    tags: {
      name: "Tags",
      validation: { required: true },
      dataType: "array",
      of: {
          dataType: "string"
      }
    },
    relatedPosts: {
      dataType: "array",
      name: "Related posts",
      of: {
          dataType: "reference",
          path: "blog-posts"
      }
    },
    topImage: buildProperty({
      name: "Top image",
      dataType: "string",
      storage: {
          storagePath: "images",
          acceptedFiles: ["image/*"]
      }
    }),
    boldContent: {
      name: "Bolded content",
      validation: { required: true },
      dataType: "string"
    },
    content: {
      name: "Content",
      validation: { required: true },
      dataType: "string"
    }
  }
});

// const productsCollection = buildCollection<Product>({
//     name: "Products",
//     singularName: "Product",
//     path: "products",
//     permissions: ({ authController }) => ({
//         edit: true,
//         create: true,
//         // we have created the roles object in the navigation builder
//         delete: false
//     }),
//     subcollections: [
//         localeCollection
//     ],
//     properties: {
//         name: {
//             name: "Name",
//             validation: { required: true },
//             dataType: "string"
//         },
//         price: {
//             name: "Price",
//             validation: {
//                 required: true,
//                 requiredMessage: "You must set a price between 0 and 1000",
//                 min: 0,
//                 max: 1000
//             },
//             description: "Price with range validation",
//             dataType: "number"
//         },
//         status: {
//             name: "Status",
//             validation: { required: true },
//             dataType: "string",
//             description: "Should this product be visible in the website",
//             longDescription: "Example of a long description hidden under a tooltip. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin quis bibendum turpis. Sed scelerisque ligula nec nisi pellentesque, eget viverra lorem facilisis. Praesent a lectus ac ipsum tincidunt posuere vitae non risus. In eu feugiat massa. Sed eu est non velit facilisis facilisis vitae eget ante. Nunc ut malesuada erat. Nullam sagittis bibendum porta. Maecenas vitae interdum sapien, ut aliquet risus. Donec aliquet, turpis finibus aliquet bibendum, tellus dui porttitor quam, quis pellentesque tellus libero non urna. Vestibulum maximus pharetra congue. Suspendisse aliquam congue quam, sed bibendum turpis. Aliquam eu enim ligula. Nam vel magna ut urna cursus sagittis. Suspendisse a nisi ac justo ornare tempor vel eu eros.",
//             enumValues: {
//                 private: "Private",
//                 public: "Public"
//             }
//         },
//         published: ({ values }) => buildProperty({
//             name: "Published",
//             dataType: "boolean",
//             columnWidth: 100,
//             disabled: (
//                 values.status === "public"
//                     ? false
//                     : {
//                         clearOnDisabled: true,
//                         disabledMessage: "Status must be public in order to enable this the published flag"
//                     }
//             )
//         }),
//         related_products: {
//             dataType: "array",
//             name: "Related products",
//             description: "Reference to self",
//             of: {
//                 dataType: "reference",
//                 path: "products"
//             }
//         },
//         main_image: buildProperty({ // The `buildProperty` method is a utility function used for type checking
//             name: "Image",
//             dataType: "string",
//             storage: {
//                 storagePath: "images",
//                 acceptedFiles: ["image/*"]
//             }
//         }),
//         tags: {
//             name: "Tags",
//             description: "Example of generic array",
//             validation: { required: true },
//             dataType: "array",
//             of: {
//                 dataType: "string"
//             }
//         },
//         description: {
//             name: "Description",
//             description: "This is the description of the product",
//             longDescription: "Example of a long description hidden under a tooltip. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin quis bibendum turpis. Sed scelerisque ligula nec nisi pellentesque, eget viverra lorem facilisis. Praesent a lectus ac ipsum tincidunt posuere vitae non risus. In eu feugiat massa. Sed eu est non velit facilisis facilisis vitae eget ante. Nunc ut malesuada erat. Nullam sagittis bibendum porta. Maecenas vitae interdum sapien, ut aliquet risus. Donec aliquet, turpis finibus aliquet bibendum, tellus dui porttitor quam, quis pellentesque tellus libero non urna. Vestibulum maximus pharetra congue. Suspendisse aliquam congue quam, sed bibendum turpis. Aliquam eu enim ligula. Nam vel magna ut urna cursus sagittis. Suspendisse a nisi ac justo ornare tempor vel eu eros.",
//             dataType: "string",
//             columnWidth: 300
//         },
//         categories: {
//             name: "Categories",
//             validation: { required: true },
//             dataType: "array",
//             of: {
//                 dataType: "string",
//                 enumValues: {
//                     electronics: "Electronics",
//                     books: "Books",
//                     furniture: "Furniture",
//                     clothing: "Clothing",
//                     food: "Food"
//                 }
//             }
//         },
//         publisher: {
//             name: "Publisher",
//             description: "This is an example of a map property",
//             dataType: "map",
//             properties: {
//                 name: {
//                     name: "Name",
//                     dataType: "string"
//                 },
//                 external_id: {
//                     name: "External id",
//                     dataType: "string"
//                 }
//             }
//         },
//         expires_on: {
//             name: "Expires on",
//             dataType: "date"
//         }
//     }
// });

export default function App() {

    const myAuthenticator: Authenticator<FirebaseUser> = useCallback(async ({
                                                                    user,
                                                                    authController
                                                                }) => {

        if (user?.email?.includes("flanders")) {
            throw Error("Stupid Flanders!");
        }

        console.log("Allowing access to", user?.email);
        // This is an example of retrieving async data related to the user
        // and storing it in the user extra field.
        const sampleUserRoles = await Promise.resolve(["admin"]);
        authController.setExtra(sampleUserRoles);

        return true;
    }, []);

    return <FirebaseCMSApp
        name={"My Online Shop"}
        authentication={myAuthenticator}
        collections={[blogPostsCollection]}
        firebaseConfig={firebaseConfig}
    />;
}