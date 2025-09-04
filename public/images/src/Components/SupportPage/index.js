import React, { useEffect, useState } from 'react'
import UserHeader from '../../Layout/UserHeader'
import LoaderHelper from '../../Utils/Loading/LoaderHelper';
import AuthService from '../../Api/Api_Services/AuthService';
import { alertErrorMessage } from '../../Utils/CustomAlertMessage';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

function SupportPage() {
  const navigate = useNavigate()
  const [openTickets, setOpenTickets] = useState([]);
  const [closedTickets, setclosedTickets] = useState();
  const [resolvedTicktes, setResolvedTicktes] = useState([]);

  const handleOpenList = async () => {

    try {
      LoaderHelper.loaderStatus(true);
      const result = await AuthService.getOpenTickets();
      if (result?.success) {
        setOpenTickets(result?.data?.reverse())
      } else {
        alertErrorMessage(result?.message);
      }
    } catch (error) {
      alertErrorMessage(error?.message);
    } finally {
      LoaderHelper.loaderStatus(false);
    }
  };

  const handleResolvedist = async () => {

    try {
      LoaderHelper.loaderStatus(true);
      const result = await AuthService.getResolvedTickets();
      if (result?.success) {
        setResolvedTicktes(result?.data?.reverse())
      } else {
        alertErrorMessage(result?.message);
      }
    } catch (error) {
      alertErrorMessage(error?.message);
    } finally {
      LoaderHelper.loaderStatus(false);
    }
  };

  const handleCloseddist = async () => {

    try {
      LoaderHelper.loaderStatus(true);
      const result = await AuthService.getClosedTickets();
      if (result?.success) {
        setclosedTickets(result?.data?.reverse())
      } else {
        alertErrorMessage(result?.message);
      }
    } catch (error) {
      alertErrorMessage(error?.message);
    } finally {
      LoaderHelper.loaderStatus(false);
    }
  };

  const handleUpdateTicketStatus = async (ticketId, status) => {

    try {
      LoaderHelper.loaderStatus(true);
      const result = await AuthService.updateTicketStatus(ticketId, status);
      if (result?.success) {
        handleCloseddist()
        handleResolvedist()
        handleOpenList()
      } else {
        alertErrorMessage(result?.message);
      }
    } catch (error) {
      alertErrorMessage(error?.message);
    } finally {
      LoaderHelper.loaderStatus(false);
    }
  };

  const navigateToChat = (id) => {
    navigate(`/dashboard/chat/${id}`)
  }

  useEffect(() => {
    handleOpenList()
    handleResolvedist()
    handleCloseddist()

    return () => {

    }
  }, []);

  return (
    <>

      <div class="dashboard_right">
        <UserHeader />
        <div class="dashboard_outer_s">
          <h2>Support Page</h2>
          <div class="dashboard_detail_s user_list_table user_summary_t">
            <div class="user_list_top">
              <div class="user_list_l">
                <h4>Issue List</h4>
              </div>
              {/* <!-- <div class="user_search">
              <button><img src="/images/search_icon.svg" alt="search"/></button>
              <input type="text" placeholder="Search"/>
            </div> --> */}
            </div>
            <div class="dashboard_summary">
              <ul class="nav nav-tabs" id="myTab" role="tablist">
                <li class="nav-item" role="presentation">
                  <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button"
                    role="tab" aria-controls="home" aria-selected="true">Open</button>
                </li>
                <li class="nav-item" role="presentation">
                  <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button"
                    role="tab" aria-controls="profile" aria-selected="false">Resolve</button>
                </li>
                <li class="nav-item" role="presentation">
                  <button class="nav-link" id="Closed-tab" data-bs-toggle="tab" data-bs-target="#Closed" type="button"
                    role="tab" aria-controls="Closed" aria-selected="false">Closed</button>
                </li>
                {/* <li class="nav-item" role="presentation">
                  <button class="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact" type="button"
                    role="tab" aria-controls="contact" aria-selected="false">Chat</button>
                </li> */}
              </ul>
              <div class="tab-content" id="myTabContent">
                <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                  <div class="table-responsive">
                    <table>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Ticket Id</th>
                          <th>Email</th>
                          <th>Issue</th>
                          <th>Exchange</th>
                          <th>Change Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {openTickets?.length > 0 ? openTickets?.map((ticket) => {
                          return (
                            <tr>
                              <td>{moment(ticket?.createdAt).format("DD/MM/YYYY  ")}</td>
                              <td>{ticket?.ticketId}</td>
                              <td>{ticket?.emailId}</td>
                              <td>{ticket?.subject}</td>
                              <td class="green">{ticket?.exchange}</td>
                              <td>
                                <div class="btn_right_t"><button class="close" onClick={() => handleUpdateTicketStatus(ticket?._id, "Closed")}>Close</button><button onClick={() => handleUpdateTicketStatus(ticket?._id, "Resolved")}>Resolve</button>
                                  <button class="chat" onClick={() => navigateToChat(ticket?._id)}>Chat</button>
                                </div>
                              </td>
                            </tr>
                          )
                        }) : <tr rowSpan="5">
                          <td colSpan="12"><div className="no-notifications">
                            <img
                              height="100px"
                              src="/images/not_found.png"
                              alt="No notifications"
                              className="no-notifications-img"
                            />
                            <p>No data found</p>
                          </div></td></tr>}


                      </tbody>
                    </table>
                  </div>
                </div>
                <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                  <div class="table-responsive">
                    <table>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Ticket Id</th>
                          <th>Issue</th>
                          <th>Exchange</th>
                          <th> Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resolvedTicktes?.length > 0 ? resolvedTicktes?.map((ticket) => {
                          return (
                            <tr>
                              <td>{moment(ticket?.createdAt).format("DD/MM/YYYY  ")}</td>
                              <td>{ticket?.ticketId}</td>
                              <td>{ticket?.emailId}</td>
                              <td>{ticket?.subject}</td>
                              <td class="green">{ticket?.exchange}</td>
                              <td>
                                <div class="btn_right_t">
                                  <button class="chat" onClick={() => navigateToChat(ticket?._id)}>View</button>
                                </div>
                              </td>
                            </tr>
                          )
                        }) : <tr rowSpan="5">
                          <td colSpan="12"><div className="no-notifications">
                            <img
                              height="100px"
                              src="/images/not_found.png"
                              alt="No notifications"
                              className="no-notifications-img"
                            />
                            <p>No data found</p>
                          </div></td></tr>}


                      </tbody>
                    </table>
                  </div>
                </div>
                <div class="tab-pane fade" id="Closed" role="tabpanel" aria-labelledby="Closed-tab">
                  <div class="table-responsive">
                    <table>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Ticket Id</th>
                          <th>Issue</th>
                          <th>Exchange</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {closedTickets?.length > 0 ? closedTickets?.map((ticket) => {
                          return (
                            <tr>
                              <td>{moment(ticket?.createdAt).format("DD/MM/YYYY  ")}</td>
                              <td>{ticket?.ticketId}</td>
                              <td>{ticket?.emailId}</td>
                              <td>{ticket?.subject}</td>
                              <td class="green">{ticket?.exchange}</td>
                              <td>
                                <div class="btn_right_t">
                                  <button class="chat" onClick={() => navigateToChat(ticket?._id)}>View</button>
                                </div>
                              </td>
                            </tr>


                          )
                        }) : <tr rowSpan="5">
                          <td colSpan="12"><div className="no-notifications">
                            <img
                              height="100px"
                              src="/images/not_found.png"
                              alt="No notifications"
                              className="no-notifications-img"
                            />
                            <p>No data found</p>
                          </div></td></tr>}


                      </tbody>
                    </table>
                  </div>
                </div>








                <div class="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">
                  <div class="row">
                    <div class="col-sm-12 col-md-12 col-lg-5">
                      <div class="support_form">
                        <form>
                          <div class="col-input_bl">
                            <div class="control_input">
                              <lable>email Id</lable>
                              <input type="email" placeholder="sonilucky79@gmail.com" />
                            </div>
                            <div class="control_input">
                              <lable>Subject</lable>
                              <input type="text" placeholder="Qcdwertyuio" />
                            </div>
                          </div>
                          <div class="col-input_bl">
                            <div class="control_input">
                              <lable>Exchange</lable>
                              <input type="text" placeholder="Qcdwertyuio" />
                            </div>
                            <div class="control_input">
                              <lable>Description</lable>
                              <textarea rows="4" cols="54"
                                placeholder="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text. Lorem Ipsum is simply dummy text of the printing and typesetting industry."></textarea>
                            </div>
                            <div class="support_screen_img">
                              <img src="/images/transfer_img.jpg" alt="transfer_img" />
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                    <div class="col-sm-12 col-md-12 col-lg-7">
                      <div class="chat_detail">
                        <div class="ticket_block">
                          <div class="top_heading_cnt">
                            <div class="cnt_left_s">
                              <h3>Chating</h3>
                            </div>
                            <div class="notification_icon">
                              <img src="/images/refersh_icon.svg" alt="setting" />
                            </div>
                          </div>
                          <div class="ticket_support_team">
                            <div class="arrow_top">
                              <img src="/images/top_arrow2.png" alt="arrow" />
                            </div>
                            <h5>Support Team:</h5>
                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                              been the industry's standard dummy text ever since the 1500s, when an unknown.</p>
                          </div>
                          <div class="ticket_support_team right_side">
                            <div class="arrow_top">
                              <img src="/images/top_arrow.png" alt="arrow" />
                            </div>
                            <h5>Lucky Sharma</h5>
                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                              been the industry's standard dummy text .</p>
                          </div>
                          <div class="ticket_support_team">
                            <div class="arrow_top">
                              <img src="/images/top_arrow2.png" alt="arrow" />
                            </div>
                            <h5>Support Team:</h5>
                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                              been the
                              industry's standard dummy text.</p>
                          </div>
                        </div>
                        <div class="ticket_resolved">
                          <h4>This ticket has been resolved</h4>
                          <button class="closed_btn">Closed</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <div class="pagination_list">
              <p>Showing data 1 to 8 of 256K entries</p>
              <ul class="pagination">
                <li class="page-item">
                  <a class="page-link" href="#" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                    <span class="sr-only">Previous</span>
                  </a>
                </li>
                <li class="page-item active"><a class="page-link" href="#">1</a></li>
                <li class="page-item"><a class="page-link" href="#">2</a></li>
                <li class="page-item"><a class="page-link" href="#">3</a></li>
                <li class="page-item"><a class="page-link" href="#">4</a></li>
                <li class="page-item"><a class="page-link" href="#">5</a></li>
                <li class="page-item"><a class="page-link" href="#">...</a></li>
                <li class="page-item">
                  <a class="page-link" href="#" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                    <span class="sr-only">Next</span>
                  </a>
                </li>
              </ul>
            </div> */}
          </div>
        </div>
      </div>
    </>
  )
}

export default SupportPage