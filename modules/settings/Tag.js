import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {Form, FormGroup, ControlLabel, FormControl, InputGroup, Checkbox, Button, OverlayTrigger, Tooltip} from 'react-bootstrap'
import AV from 'leancloud-storage/live-query'

export default class Tag extends Component {

  constructor(props) {
    super(props)
    this.state = {
      tagMetadata: null,
      key: '',
      values: [''],
      userRead: false,
      userWrite: false,
      isSubmitting: false,
    }
  }

  componentDidMount() {
    const id = this.props.params.id
    return Promise.resolve()
    .then(() => {
      if (id == 'new') {
        return new AV.Object('TagMetadata', {
          key: '',
          values: [''],
          userRead: false,
          userWrite: false,
          ACL: {
            'role:customerService': {write: true, read: true}
          },
        })
      } else {
        return AV.Object.createWithoutData('TagMetadata', id)
        .fetch()
      }
    })
    .then(tagMetadata => {
      this.setState({
        tagMetadata,
        key: tagMetadata.get('key'),
        values: tagMetadata.get('values'),
        userRead: tagMetadata.get('userRead'),
        userWrite: tagMetadata.get('userWrite'),
      })
      return
    })
  }

  handleChangeUserPermission(permission, value) {
    if (permission == 'read') {
      if (value) {
        this.setState({userRead: true})
      } else {
        this.setState({userRead: false, userWrite: false})
      }
    } else if (permission == 'write') {
      if (value) {
        this.setState({userRead: true, userWrite: true})
      } else {
        this.setState({userWrite: false})
      }
    }
  }

  handleKeyChange(e) {
    this.setState({key: e.target.value})
  }

  addValueItem() {
    const values = this.state.values
    values.push('')
    this.setState({values})
  }

  changeValue(index, value) {
    const values = this.state.values
    values[index] = value
    this.setState({values})
  }

  handleSortUpdate(value, oriIndex, newIndex) {
    const values = this.state.values
    values.splice(oriIndex, 1)
    values.splice(newIndex, 0, value)
    this.setState({values})
  }

  handleRemoveItem(index) {
    const values = this.state.values
    values.splice(index, 1)
    this.setState({values})
  }

  handleRemove() {
    const result = confirm('确认要删除标签：' + this.state.tagMetadata.get('key'))
    if (result) {
      this.state.tagMetadata.destroy()
      .then(() => {
        this.context.router.push('/settings/tags')
        return
      })
      .catch(this.context.addNotification)
    }
  }

  handleSubmit(e) {
    e.preventDefault()
    this.setState({isSubmitting: true})
    
    const tagMetadata = this.state.tagMetadata
    if (this.state.key != tagMetadata.get('key')) {
      tagMetadata.set('key', this.state.key)
    }

    if (this.state.values != tagMetadata.get('values')) {
      tagMetadata.set('values', this.state.values)
    }

    if (this.state.userRead != tagMetadata.get('userRead')) {
      tagMetadata.set('userRead', this.state.userRead)
      tagMetadata.set('ACL', {
        '*': {read: this.state.userRead},
        'role:customerService': {write: true, read: true}
      })
    }

    if (this.state.userWrite != tagMetadata.get('userWrite')) {
      tagMetadata.set('userWrite', this.state.userWrite)
    }

    return tagMetadata.save()
    .then(() => {
      this.setState({isSubmitting: false})
      this.context.router.push(`/settings/tags/${tagMetadata.id}`)
      return
    })
    .then(this.context.addNotification)
    .catch(this.context.addNotification)
  }

  render() {
    return <Form onSubmit={this.handleSubmit.bind(this)}>
      <FormGroup controlId="tagNameText">
        <ControlLabel>标签名称</ControlLabel>
        <FormControl type="text" value={this.state.key} onChange={this.handleKeyChange.bind(this)} />
      </FormGroup>
      <Checkbox
        checked={this.state.userRead}
        onChange={(e) => this.handleChangeUserPermission('read', e.target.checked)}>
        用户可见
        {' '}<OverlayTrigger placement="right" overlay={
          <Tooltip id="tooltip">
            如果勾选，则用户可以在工单详情页看到该标签，但不能修改其值。
          </Tooltip>}>
          <span className="glyphicon glyphicon-question-sign" aria-hidden="true"></span>
        </OverlayTrigger>
      </Checkbox>
      <Checkbox
        checked={this.state.userWrite}
        onChange={(e) => this.handleChangeUserPermission('write', e.target.checked)}>
        用户可改
        {' '}<OverlayTrigger placement="right" overlay={
          <Tooltip id="tooltip">
            如果勾选，则用户可以在新建工单时看到该标签选项，并选择预设的值。也可以在工单详情页看到该标签。
          </Tooltip>}>
          <span className="glyphicon glyphicon-question-sign" aria-hidden="true"></span>
        </OverlayTrigger>
      </Checkbox>
      <FormGroup controlId="tagNameText">
        <ControlLabel>标签可选值</ControlLabel>
        {this.state.values.map((value, index, array) => {
          return <InputGroup>
              <FormControl type='text' value={value} onChange={(e) => this.changeValue(index, e.target.value)} />
              <InputGroup.Button>
                <Button disabled={index == 0} onClick={() => this.handleSortUpdate(value, index, index - 1)}><span className="glyphicon glyphicon glyphicon-chevron-up" aria-hidden="true" /></Button>
                <Button disabled={index == array.length - 1} onClick={() => this.handleSortUpdate(value, index, index + 1)}><span className="glyphicon glyphicon glyphicon-chevron-down" aria-hidden="true" /></Button>
                <Button onClick={() => this.handleRemoveItem(index)}><span className="glyphicon glyphicon-remove" aria-hidden="true" /></Button>
              </InputGroup.Button>
            </InputGroup>
        })}
        <Button type='button' onClick={this.addValueItem.bind(this)}><span className="glyphicon glyphicon glyphicon-plus" aria-hidden="true" /></Button>
      </FormGroup>
      <Button type='submit' bsStyle='success'>保存</Button>
      {' '}
      {this.state.tagMetadata && this.state.tagMetadata.id
        && <Button type='button' onClick={this.handleRemove.bind(this)} bsStyle="danger">删除</Button>}
      {' '}
      <Button type='button' onClick={() => this.context.router.push('/settings/tags')}>返回</Button>
    </Form>
  }
}

Tag.propTypes = {
  params: PropTypes.object.isRequired,
}

Tag.contextTypes = {
  router: PropTypes.object.isRequired,
  addNotification: PropTypes.func.isRequired,
}
