import { v1 } from '@google-cloud/automl'

const { PredictionServiceClient } = v1

const client = new PredictionServiceClient()

export async function extract(text: string) {
  const [response] = await client.predict({
    name: client.modelPath(process.env.GCLOUD_PROJECT!, 'us-central1', 'TEN3354145982437654528'),
    payload: {
      textSnippet: {
        content: text,
        mimeType: 'text/plain',
      },
    },
  })

  return (
    response.payload
      ?.filter((item) => !!item.textExtraction)
      .map((item) => ({
        label: item.displayName!,
        text: item.textExtraction!.textSegment!.content!,
        confidence: item.textExtraction!.score!,
      })) || []
  )
}
