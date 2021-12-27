// localhost:3000/
import { useState, useEffect } from 'react'
import MeetupList from '../components/meetups/MeetupList'
import { MongoClient } from 'mongodb' // it won't appear in the bundle for the client since we are using this import in the getStaticProps(which will be executed during build only)
import Head from 'next/head'

const DUMMY_MEETUPS = [{
        id: 'm1',
        title: 'A First Meetup',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/640px-Stadtbild_M%C3%BCnchen.jpg',
        address: 'Some address 5, 12345 Some City',
        description: 'This is my first meetup!'
    },
    {
        id: 'm2',
        title: 'A Second Meetup',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/St._Paul_M%C3%BCnchen.jpg/640px-St._Paul_M%C3%BCnchen.jpg',
        address: 'Some address 5, 12345 Some City',
        description: 'This is my second meetup!'
    },
    {
        id: 'm3',
        title: 'A Third Meetup',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Edificio_principal%2C_Jard%C3%ADn_Bot%C3%A1nico%2C_M%C3%BAnich%2C_Alemania_2012-04-21%2C_DD_06.JPG/640px-Edificio_principal%2C_Jard%C3%ADn_Bot%C3%A1nico%2C_M%C3%BAnich%2C_Alemania_2012-04-21%2C_DD_06.JPG',
        address: 'Some address 5, 12345 Some City',
        description: 'This is my third meetup!'
    }
]

export async function getStaticProps(context) { // it can be async or not
    // fetch data from API or DB
    // read data from fs

    // since these 3 lines are used often we could create a function for it
    // here this fetch wasn't in the api folder as an example yet it's better to write it in the api folder
    const client = await MongoClient.connect(process.env.CONNECTION_URL)
    const db = client.db()
    const meetupsCollection = db.collection('meetups')

    const meetups = await meetupsCollection.find().toArray()
    client.close()

    return {
        props: {
            meetups: meetups.map(meetup => ( // the data will be loaded in the getStaticProps (during build)
                {
                    title: meetup.title,
                    address: meetup.address,
                    image: meetup.image,
                    id: meetup._id.toString(),
                }
            ))
        },
        revalidate: 10 // this page will be generated on the server at least every 10s if there are req to this page (for 10 continuous sec) --> regenerated will replace pregenerated ==> you ensure your data is never older than 10s

        // * live: 100K/sec => getServerSideProps => 100K req/database [BAD]
        // * live: 100K/sec => getStaticProps => 1 req/sec on the database [Super Awesome]
    }
}

// export async function getServerSideProps(context) { // it can be async or not
//     // fetch data from API or DB
//     // read data from fs

//     const req = context.req // accessing the req object
//     const res = context.res // accessing the res object

//     return {
//         props: {
//             meetups: DUMMY_MEETUPS
//         }
//     }
// }

export default function HomePage(props) {
    // We no longer need to manage the state with useState & use useEffect, we can get our data from props.meetups that was loaded during build time (since we used the getStaticProps)
    // const [loadedMeetups, setLoadedMeetups] = useState([])
    // useEffect(() => {
    //     ? fetch data and set it in the state --> the data will be available in the second component render cycle on the client side --> there will be a loading state & an empty html for the SEO
    //     setLoadedMeetups(DUMMY_MEETUPS)
    // }, [])
    console.log(process.env.NEXT_PUBLIC_TEST)
    return (
        <>
            <Head>
                <title>React Meetups</title>
                <meta name='description' content='Browse a huge list of highly active React meetups' />
            </Head>
            <MeetupList meetups = { props.meetups } />
        </>
    )
}

/*
 - pre-rendering is used when we need to fetch(wait) data and populate the html content for better SEO or for server side functions like connecting to a db
 - not all pages need the pre-rendering like the new-meetup page (form), it can be static (static html with no content (no initial props))
 - Two forms of pre-rendering: Static Generation & Server-side Rendering:

 1) Static Generation SSG(static side generation) | ISG (incremental side generation, if it has revalidate) (for pages that don't get updated frequently like personal blogs):
    > Only for components inside the pages folder (function components)
    > For pages & their contents that don't change all the time
    > It's pre-rendered when you build the nextJS project for production (not pre-rendered on the fly on the server when a req is made)
    > After deployment the pre-render page doesn't change anymore (not by default at least)
    > If your data/content has updated & the pre-rendered page needs to change --> you need to rebuild & redeploy again (if the update is frequent, this is not the suitable pre-render method)
    > If you need to wait for data or to add data fetching to a page component --> export function getStaticProps which will be called before component function(HomePage)
    > Any code written in getStaticProps will never end up nor be executed on the client side (this code is executed during the build process / not on the server nor on the clients(browser/machine) of your visitors)
    > You can write any code in getStaticProps that would normally run on a server (access a file system or connect securely to a db)
    > Always return an object, with a props object from getStaticProps that the component function will recieve as props
    > If the data does change more frequently, we can add an additional object to the return called revalidate which will unlock a feature called incremental static generation
    > The object revalidate will take a number, & this number is the number of sec nextJS will wait until it regenerates this page for an incoming req --> this page will not be just generated during the build process but also every number of sec on the server (at least if there req to this page), thus it will be re-pre-rendered on the server after deployment every number of sec (no need to rebuild & redeploy)
    > You recieve a parameter called context which will allow you to access diff props like params
    > Uses caching of the pre-generated page

 Sometimes a regular update after build & deployment is not enough even if the validate is set to 1s, sometimes you need to regenerate the page for every incoming req, so you want to pre-generate the page dynamically on the fly after deployment on the server (not during the build nor after every couple of sec but for every req)

 2) Server-side Rendering (for pages where data is changing frequently & if you need to access the incoming req object):
    > Will not run during the build process but always on the server after deployment with each req
    > Any code you write here will always run on the server not on the client, you can also use operations that use credentials that should not be exposed to your users
    > How ? --> export function getServerSideProps which returns an object that also has props object
    > You recieve a parameter called context, from which you can access the req & res object (like in nodeJS) / you don't return a res but an object with props object which holds the props for this page component function
    > Is good for the authentication purposes
    > For pages where at build time template would't make sense (deploying everytime is costly & each page is would look differently according to the logged user)
    > You wait for your page to be generated for every incoming req
    > Slower than Static Generation (if data doesn't change frequently Static Generation is better)
     
*/