import React, {Component} from 'react'
import {Link} from 'react-router'
import {Form, FormGroup, Table} from 'react-bootstrap'
import AV from 'leancloud-storage/live-query'

export default class Tags extends Component {

  constructor(props) {
    super(props)
    this.state = {
      tagMetadatas: [],
    }
  }

  componentDidMount() {
    return new AV.Query('TagMetadata')
    .find()
    .then(tagMetadatas => {
      this.setState({tagMetadatas})
      return
    })
  }

  render() {
    return <div>
      <Form inline>
        <FormGroup>
          <Link to={'/settings/tags/new'}>新增标签</Link>
        </FormGroup>{' '}
      </Form>
      <Table>
        <thead>
          <tr>
            <th>标签名称</th>
          </tr>
        </thead>
        <tbody>
          {this.state.tagMetadatas.map(m => {
            return <tr key={m.id}>
              <td><Link to={`/settings/tags/${m.id}`}>{m.get('key')}</Link></td>
            </tr>
          })}
        </tbody>
      </Table>
    </div>
  }
}
