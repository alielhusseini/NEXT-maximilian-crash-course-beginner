import classes from './MainNavigation.module.css'
import Link from 'next/link'

// <Link href='/'><a>Home</a></Link>
// <Link href='/' passHref><h1>Home</h1></Link>

export default function MainNavigation() {
    return (
        <header className={classes.header}>
            <div className={classes.logo}>React Meetups</div>
            <nav>
                <ul>
                    <li><Link href='/' passHref>All Meetups</Link></li>
                    <li><Link href='/new-meetup' passHref>Add New Meetup</Link></li>
                </ul>
            </nav>
        </header>
    )
}
