// localhost:3000/:meetupId
import MeetupDetail from "../../components/meetups/MeetupDetail";

export async function getStaticPaths() {
    // as a developer you wouldn't hard code this, but you would fetch the supported ids from a db or api & generate this array dynamically

    return {
        fallback: false,
        paths: [
            {
                params: {
                    meetupId: 'm1'
                }
            },
            {
                params: {
                    meetupId: 'm2'
                }
            },
            {
                params: {
                    meetupId: 'm3'
                }
            },
        ]
    }
}

export async function getStaticProps(context) { // during build time
    // fetch data for a single meetup
    // useRouter can be accessed only on the function component --> to access the param of the url, we use context
    const meetupId = context.params.meetupId // identifier between the [] on the pages folder

    return {
        props: {
            meetupData: {
                img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/640px-Stadtbild_M%C3%BCnchen.jpg',
                title: 'My First Tour',
                description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
                address: 'Somt St.15, 12345 Some City',
                id: meetupId
            }
        }
    }
}

export default function MeetupDetailsPage(props) {
    return (
        <MeetupDetail 
            img={props.meetupData.img}
            title={props.meetupData.title}
            description={props.meetupData.description}
            address={props.meetupData.address}
        />   
    )     
}

/*
 getStaticPaths is a function you need to export in a page component file, if it's a dynamic page & you're using getStaticProps

 getStaticProps: a page is pre-generated during the build process --> nextJS needs to pre-generate all versions of the dynamic pages in advance for all the supported ids 
 ==> we use getStaticPaths which returns an object with paths key (array)

 The paths array must have multiple objs (one obj per version of the dynamic page), and each obj must have params key (which is an obj) with key-value pairs that might lead to your dynamic page (if you have multiple dynamic segments then you will have multiple keys in the nested params obj)

 In addition to the paths key, you need to add a fallback key (boolean). If you set it to false --> you are saying that paths contain all supported meetupId values. That means if the user enters anything not supported in the paths, they would see a 404 error. If you set it to true --> nextJS would try & generate a page for the new meetupId dynamically on the server for the incoming req

 Usually we can pre-generate the most viewed pages by the users (if we have 100 pages and we know most visited pages are of ids 1,2,3 => fallback to true with the paths params of id 1,2,3 --> no need to pre-generate all 100 pages)
 
 (if user inserted a dynamic page in which we didn't pre-generate a page in getStaticPaths,   they will see a 404 error)
*/
