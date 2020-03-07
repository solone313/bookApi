import React, {useState, useEffect } from 'react'
import { Row, Col, List } from 'antd';
import Axios from 'axios';
import SideBook from './Sections/SideBook';
import Subscribe from './Sections/Subscribe';
import Comment from './Sections/Comment';
import StarRatings from 'react-star-ratings';

function BookDetailPage(props) {
    const bookId = props.match.params.bookId
    const variable = { bookId: bookId }
    const [BookDetail, setBookDetail] = useState([])
    const [CommentLists, setCommentLists] = useState([])
    const [BookScore, setBookScore] = useState(0)
    useEffect(() => {
        Axios.post('/api/book/getBookDetail', variable)
            .then(response => {
                if(response.data.success){
                    // console.log(response.data.book)
                    setBookDetail(response.data.book)
                }else {
                    alert('북 정보를 가져오기를 실패했습니다.')
                }
            })
        Axios.post('/api/comment/getComments', variable)
            .then(response => {
                if(response.data.success){
                    // console.log('response.data.comments',response.data.comments)
                    setCommentLists(response.data.comments)
                } else {
                    alert('코멘트 정보를 가져오는 것을 실패했습니다.')
                }
            })
        Axios.post('/api/comment/getBookscore', variable)
        .then(response => {
            if(response.data.success){
                // console.log('response.data.rating',response.data.rating, typeof(response.data.rating))
                setBookScore(parseFloat(response.data.rating));
            } else {
                alert('코멘트 정보를 가져오는 것을 실패했습니다.')
            }
        })
    }, [])
    const updateComment  = (newComment) => {
        setCommentLists(CommentLists.concat(newComment))
        Axios.post('/api/comment/getBookscore', variable)
        .then(response => {
            if(response.data.success){
                // console.log('response.data.rating',response.data.rating, typeof(response.data.rating))
                setBookScore(parseFloat(response.data.rating));
            } else {
                alert('코멘트 정보를 가져오는 것을 실패했습니다.')
            }
        })
    }
    if(BookDetail.writer) {
        return(
        <div>
        <Row gutter={[16, 16]}>
            <Col lg={18} xs={24}>
                <div style={{ width: '100%', padding:'3rem 4rem'}}>
                    <img src={`${BookDetail.filePath}`} style={{width: '40%', float: 'left' }} alt="DetailImg"/>
                    <div className="Detail__container" style={{width:'50%', float:'right'}}>
                        <h1 className="Detail_title"> { BookDetail.title } </h1>
                        <h3 className="Detail_description"> { BookDetail.year + ',' +BookDetail.author + '  ' + BookDetail.publisher } </h3>
                        <br/>
                        <h4 className="Detail_star"> {BookScore === 0 ? '첫 리뷰를 등록해주세요': `평점: ${BookScore}` }</h4>
                        <StarRatings
                            rating={BookScore}
                            starRatedColor="blue"
                            starDimension="20px"
                            starSpacing="1px"
                        />
                        <br/><br/>
                        <Subscribe userTo={BookDetail._id} userFrom={localStorage.getItem('userId')} />
                    </div>
                </div>
            </Col>
            <Col lg={6} xs={24}>
                <SideBook />
            </Col>
        </Row>
        <Row gutter={[16, 16]}>
            <Col lg={18} xs={24}>
                <div style={{ width: '100%', padding:'3rem 4rem'}}>
                    <List.Item>
                            <List.Item.Meta
                                title= '책소개'
                                description={ BookDetail.description }
                            />
                    </List.Item>
                    <Comment CommentLists={CommentLists} postId={bookId} refreshFunction={updateComment} />
                </div>
            </Col>
        </Row>        
        </div>
    )
    } else{
        return (
            <div>...Loding</div>
        )
    }
   
}
export default BookDetailPage