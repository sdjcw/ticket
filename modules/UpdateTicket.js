import React, {Component} from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import {FormGroup, ControlLabel, FormControl} from 'react-bootstrap'
import AV from 'leancloud-storage/live-query'

import css from './Ticket.css'
import csCss from './CustomerServiceTickets.css'

import {getCustomerServices, CategoriesSelect, depthFirstSearchFind, UserLabel, getCategoryPathName} from './common'

export default class UpdateTicket extends Component {
  constructor(props) {
    super(props)
    this.state = {
      category: null,
      assignees: [],
    }
  }



  render() {
  }

}

UpdateTicket.propTypes = {
  ticket: PropTypes.instanceOf(AV.Object).isRequired,
  isCustomerService: PropTypes.bool,
  updateTicketAssignee: PropTypes.func.isRequired,
  categoriesTree: PropTypes.array.isRequired,
  tagMetadatas: PropTypes.array,
  tags: PropTypes.array,
}

UpdateTicket.contextTypes = {
  addNotification: PropTypes.func.isRequired,
}
