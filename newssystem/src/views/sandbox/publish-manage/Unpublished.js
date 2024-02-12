import { Button } from 'antd';
import NewsPublish from '../../../components/publish-manage/NewsPublish';
import usePublish from '../../../components/publish-manage/usePublish';


export default function UnPublished() {

  const { dataSource, handlePublish} = usePublish(1)

  return (
    <div>
      <NewsPublish dataSource={dataSource} button={(id) => {
        return <Button type='primary' onClick={() => handlePublish(id)}>发布</Button>
      }} >

      </NewsPublish>
    </div>
  )
}
