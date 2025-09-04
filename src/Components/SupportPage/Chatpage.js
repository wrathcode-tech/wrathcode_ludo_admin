import React, { useEffect, useRef, useState } from 'react'
import UserHeader from '../../Layout/UserHeader'
import { Link, useParams } from 'react-router-dom'
import LoaderHelper from '../../Utils/Loading/LoaderHelper';
import AuthService from '../../Api/Api_Services/AuthService';
import { alertErrorMessage } from '../../Utils/CustomAlertMessage';
import { imageUrl } from '../../Api/Api_Config/ApiEndpoints';

const Chatpage = () => {
  const { id } = useParams()
  const [ticketDetails, setTicketDetails] = useState();
  const [messageQuery, setMessageQuery] = useState([]);
  const [messagerply, setMessageRply] = useState('');
  const messagesEndRef = useRef()

  const handleCloseddist = async (id) => {

    try {
      LoaderHelper.loaderStatus(true);
      const result = await AuthService.adminViewTicket(id);
      if (result?.success) {
        setTicketDetails(result?.data)
        setMessageQuery(result?.data?.ticket)
      } else {
        alertErrorMessage(result?.message);
      }
    } catch (error) {
      alertErrorMessage(error?.message);
    } finally {
      LoaderHelper.loaderStatus(false);
    }
  };

  const handleMessageQuery = async (messagerply) => {
    if (!messagerply) {
      return
    }
    LoaderHelper.loaderStatus(true);
    await AuthService.replyTicket(messagerply, id).then(async result => {
      if (result?.success) {
        try {
          LoaderHelper.loaderStatus(false);
          setMessageRply("");
          handleCloseddist(id)
        } catch (error) {
          LoaderHelper.loaderStatus(false);
          alertErrorMessage(error);
        }
      } else {
        LoaderHelper.loaderStatus(false);
        alertErrorMessage(result.msg);
      }
    });
  }

  useEffect(() => {
    const container = messagesEndRef.current;
    if (container) {
      requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight;
      });
    }

  }, [messageQuery]);

  useEffect(() => {

    handleCloseddist(id)
  }, [id]);


  return (
    <>

      <div class="dashboard_right">
        <UserHeader />
        <div class="dashboard_outer_s">
          <h2>Support Page</h2>
          <Link to='/dashboard/support'>{"< "}Back</Link>
          <div class="dashboard_detail_s user_list_table user_summary_t">
            <div class="user_list_top">

              <div class="row">
                <div class="col-sm-12 col-md-12 col-lg-5">
                  <div class="support_form">
                    <form>
                      <div class="col-input_bl">
                        <div class="control_input">
                          <lable>email Id</lable>
                          <input type="email" value={ticketDetails?.emailId || "---"} disabled />
                        </div>
                        <div class="control_input">
                          <lable>Subject</lable>
                          <input type="text" value={ticketDetails?.subject || "---"} disabled />
                        </div>
                      </div>
                      <div class="col-input_bl">
                        <div class="control_input">
                          <lable>Exchange</lable>
                          <input type="text" value={ticketDetails?.exchange || "---"} disabled />
                        </div>
                        <div class="control_input">
                          <lable>Status</lable>
                          <input type="text" value={ticketDetails?.status || "---"} disabled />
                        </div>
                        <div class="control_input">
                          <lable>Description</lable>
                          <textarea rows="4" cols="54"
                            value={ticketDetails?.description || "---"} disabled></textarea>
                        </div>
                        {ticketDetails?.issueImage &&
                          <div class="support_screen_img">
                            <img src={imageUrl + ticketDetails?.issueImage} alt="transfer_img" />
                          </div>
                        }
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
                        <div class="notification_icon" onClick={()=> handleCloseddist(id)}>
                          <img src="/images/refersh_icon.svg" alt="setting" />
                        </div>
                      </div>
                      <div className="ticket_block" ref={messagesEndRef}>

                      {messageQuery?.length > 0 ?   messageQuery.map((msg, index) => (

                        <div
                          ref={messagesEndRef}
                          key={index}
                          className={`ticket_support_team ${msg.replyBy === 1 ? 'right_side commenet_cnt_r' : ''}`}
                        >
                        
                          <h5>{msg.replyBy === 1 ? 'User:' : 'Support Team:'}</h5>
                          <div dangerouslySetInnerHTML={{
                            __html: ` ${msg?.query.replace(
                              /\n/g,
                              "<br>"
                            )}`,
                          }}></div>
                        </div>
                      )):<div className="no-notifications">
                      <img
                        height="100px"
                        src="/images/not_found.png"
                        alt="No notifications"
                        className="no-notifications-img"
                      />
                      <p>No data found</p>
                    </div>}



                    </div>
                    </div>

                    {ticketDetails?.status === "Open" ? (
                      <div className="control_input">
                        <div class="input_filed">
                          <textarea
                            //   rows="5"
                            //   cols="50"
                            placeholder="Reply here..."
                            value={messagerply}
                            onChange={(e) => setMessageRply(e.target.value)}
                          />
                          <button class="get_otp textareaotp" disabled={!messagerply} onClick={() => handleMessageQuery(messagerply)}>Send</button>
                        </div>
                      </div>
                    ) :
                      (
                        <div className="ticket_resolved">
                          <h4>This ticket has been resolved</h4>
                          <button className="closed_btn">Closed</button>
                        </div>
                      )}
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default Chatpage
