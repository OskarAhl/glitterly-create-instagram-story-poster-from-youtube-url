import Head from 'next/head'
import { useState, useEffect } from 'react'
import { post } from 'axios'
import styles from '../styles/Home.module.css'

export default function Home() {
    return (
        <div>
            <Head>
                <title>Youtube Video to Instagram Story Poster</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <Form />
            </main>
        </div>
    )
}

const FORM_STATE = {
    DEFAULT: '',
    LOADING: 'LOADING',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR',
}

const url_regex = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)|\/|\?)*)?$/i
export const validURL = (str) => url_regex.test(str)

const Form = () => {
    const [form_state, setFormState] = useState(FORM_STATE.DEFAULT)
    const [error, setError] = useState('')
    const [url, setUrl] = useState('')
    const [poster_image, setPosterImage] = useState('')

    const onCreateImage = async (e) => {
        e.preventDefault()

        if (!validURL(url) || !url) return setError('Please add a valid url')

        setFormState(FORM_STATE.LOADING)
        setPosterImage('')
        setError('')

        try {
            const { data } = await post('/api/image-maker', { url })
            setPosterImage(data.url)
        } catch (error) {
            const err_msg = error.response?.data?.status || 'Something went wrong'
            setError(err_msg)
        } finally {
            setFormState(FORM_STATE.DEFAULT)
        }
    }

    const is_loading = form_state === FORM_STATE.LOADING
    return (
        <>
            <section className={styles.section}>
                <h1 className={styles.header}>
                    <span role="img" aria-label="lightning">
                        ⚡️
                    </span>{' '}
                    Paste a Youtube URL
                </h1>
                <form onSubmit={onCreateImage}>
                    <label className={styles.label} htmlFor="youtube-url">
                        Url:
                    </label>
                    <div className={styles.inputwrapper}>
                        <input
                            type="text"
                            id="youtube-url"
                            name="youtube-url"
                            disabled={is_loading}
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className={styles.input}
                            placeholder="Youtube URL"
                        />
                        <button className={styles.button} disabled={is_loading} type="submit">
                            {is_loading ? <Spinner /> : 'Create Poster'}
                        </button>
                    </div>
                    {error && <p style={{ marginBottom: '0px', marginTop: '6px' }}>{error}</p>}
                </form>
            </section>
            {poster_image && <Result poster_image={poster_image} />}
        </>
    )
}

const Spinner = () => (
    <div className={styles.spinner}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
)
const Result = ({ poster_image }) => {
    return (
        <div>
            <h2>🎉 Tada:</h2>
            <img style={{ width: '300px' }} alt="Instagram poster" src={poster_image} />
        </div>
    )
}
