import { post } from 'axios'
const MetadataParser = require('html-metadata-parser')

// replace this with your API_KEY
// This test key only works for one template
const MY_GLITTERLY_API_KEY = '740c1108-8305-4494-9b46-544131f7cc2c'
const MY_GLITTERLY_TEMPLATE_ID = 'OfkWF5Osc11PyNGsMz7E'

export default async (req, res) => {
    const { url } = req.body
    const parser_result = await MetadataParser.parser(url)
    const { meta, og } = parser_result

    const changes = [
        {
            layer: 'thumbnail',
            url: og.images[0].url,
        },
        {
            layer: 'video_title',
            text: meta.title,
        },
        {
            layer: 'site',
            text: og.site_name,
        },
    ]

    const config = { headers: { 'x-api-key': MY_GLITTERLY_API_KEY } }
    const { data } = await post(
        'https://www.glitterly.app/api/image',
        { template_id: MY_GLITTERLY_TEMPLATE_ID, changes },
        config
    )

    return res.status(200).json({ status: 'success', url: data.url })
}
