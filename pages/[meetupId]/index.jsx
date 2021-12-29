// localhost:3000/:meetupId
import MeetupDetail from "../../components/meetups/MeetupDetail"
import { MongoClient, ObjectId } from "mongodb"
import Head from 'next/head'
import { useRouter } from "next/router"

export async function getStaticPaths() { // fetch ids
    // as a developer you wouldn't hard code this, but you would fetch the supported ids from a db or api & generate this array dynamically

    const client = await MongoClient.connect(process.env.CONNECTION_URL)
    const db = client.db()
    const meetupsCollection = db.collection('meetups')

    const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray() // find all, get me the ids only
    client.close()

    return {
        fallback: 'blocking',
        paths: meetups.map(meetup => ({
                params: {
                    meetupId: meetup._id.toString()
                }
            }))
            // paths: [
            //     {
            //         params: {
            //             meetupId: 'm1'
            //         }
            //     },
            //     {
            //         params: {
            //             meetupId: 'm2'
            //         }
            //     },
            //     {
            //         params: {
            //             meetupId: 'm3'
            //         }
            //     },
            // ]
    }
}

export async function getStaticProps(context) { // during build time
    // fetch data for a single meetup
    // useRouter can be accessed only on the function component --> to access the param of the url, we use context
    const meetupId = context.params.meetupId // identifier between the [] on the pages folder

    const client = await MongoClient.connect(process.env.CONNECTION_URL)
    const db = client.db()
    const meetupsCollection = db.collection('meetups')

    const meetup = await meetupsCollection.findOne({ _id: ObjectId(meetupId) })
    client.close()
    
    if (!meetup._id) return { notFound: true } // will return 404 page

    return {
        props: {
            meetupData: {
                id: meetup._id.toString(),
                title: meetup.title,
                address: meetup.address,
                image: meetup.image,
                description: meetup.description,
            }
        }
    }
}

export default function MeetupDetailsPage(props) {
    const router = useRouter()

    if (router.isFallback) return <h1>Loading...</h1> // if fallback is true, if blocking then you won't see it (if very slow you use true if not fallback)

    return ( 
        <>
            <Head>
                <title>{ props.meetupData.title }</title>
                <meta name='description' content={props.meetupData.description} />
            </Head>
            <MeetupDetail image = { props.meetupData.image }
                title = { props.meetupData.title }
                description = { props.meetupData.description }
                address = { props.meetupData.address }
            />   
        </>
    )
}

/*
 getStaticPaths is a function you need to export in a page component file, if it's a dynamic page & you're using getStaticProps (build time) : creating pages with some ids (pointed in getStaticPaths) on build time

 getStaticProps: a page is pre-generated during the build process --> nextJS needs to pre-generate all versions of the dynamic pages in advance for all the supported ids 
 ==> we use getStaticPaths which returns an object with paths key (array)

 The paths array must have multiple objs (one obj per version of the dynamic page), and each obj must have params key (which is an obj) with key-value pairs that might lead to your dynamic page (if you have multiple dynamic segments then you will have multiple keys in the nested params obj)

 In addition to the paths key, you need to add a fallback key (boolean). If you set it to false --> you are saying that paths contain all supported meetupId values. That means if the user enters anything not supported in the paths, they would see a 404 error. If you set it to true --> nextJS would try & generate a page for the new meetupId dynamically on the server for the incoming req

 Usually we can pre-generate the most viewed pages by the users (if we have 100 pages and we know most visited pages are of ids 1,2,3 => fallback to true with the paths params of id 1,2,3 --> no need to pre-generate all 100 pages)
 
 (if user inserted a dynamic page in which we didn't pre-generate a page in getStaticPaths,   they will see a 404 error)
*/
