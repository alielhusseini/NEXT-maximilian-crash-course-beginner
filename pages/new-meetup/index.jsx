// localhost:3000/new-meetup
import NewMeetupForm from '../../components/meetups/NewMeetupForm'
import axios from 'axios'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function NewMeetupPage() {
    const router = useRouter()
    const addMeetupHandler = async(meetupData) => {
        const res = await axios.post('/api/new-meetup', {
            title: meetupData.title,
            image: meetupData.image,
            address: meetupData.address,
            description: meetupData.description
        })
        // or
        // await fetch('/api/new-meetup', {
        //     method: 'POST',
        //     body: JSON.stringify(meetupData),
        //     headers: { 'Content-Type': 'application/json' }
        // })
        router.push('/')
    }

    return (
        <>
            <Head>
                <title>React Meetups</title>
                <meta name='description' content='Browse a huge list of highly active React meetups' />
            </Head>
            <NewMeetupForm onAddMeetup={addMeetupHandler} />
        </>
    )
}
