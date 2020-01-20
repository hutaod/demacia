import React, { useState } from 'react'
import { Row, Col, Select, List, Icon } from 'antd'
import throttle from 'lodash/throttle'
import classnames from 'classnames'
import styles from './styles.module.less'

const Option = Select.Option
const categorys = [
  { label: '首页', value: 'all' },
  { label: '前端', value: 'frontend' }
]
const orders = [
  { label: '热门', value: 'heat' },
  { label: '最新', value: 'time' }
]

function formatMsgTime(dateStr) {
  var date = new Date(dateStr)
  const timestamp = date.getTime() / 1000

  function zeroize(num) {
    return (String(num).length == 1 ? '0' : '') + num
  }

  var curTimestamp = parseInt(new Date().getTime() / 1000) //当前时间戳
  var timestampDiff = curTimestamp - timestamp // 参数时间戳与当前时间戳相差秒数

  var curDate = new Date(curTimestamp * 1000) // 当前时间日期对象
  var tmDate = new Date(timestamp * 1000) // 参数时间戳转换成的日期对象

  var Y = tmDate.getFullYear(),
    m = tmDate.getMonth() + 1,
    d = tmDate.getDate()
  var H = tmDate.getHours(),
    i = tmDate.getMinutes(),
    s = tmDate.getSeconds()

  if (timestampDiff < 60) {
    // 一分钟以内
    return '刚刚'
  } else if (timestampDiff < 3600) {
    // 一小时前之内
    return Math.floor(timestampDiff / 60) + '分钟前'
  } else if (
    curDate.getFullYear() == Y &&
    curDate.getMonth() + 1 == m &&
    curDate.getDate() == d
  ) {
    return '今天' + zeroize(H) + ':' + zeroize(i)
  } else {
    var newDate = new Date((curTimestamp - 86400) * 1000) // 参数中的时间戳加一天转换成的日期对象
    if (
      newDate.getFullYear() == Y &&
      newDate.getMonth() + 1 == m &&
      newDate.getDate() == d
    ) {
      return '昨天' + zeroize(H) + ':' + zeroize(i)
    } else if (curDate.getFullYear() == Y) {
      return (
        zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i)
      )
    } else {
      return (
        Y +
        '年' +
        zeroize(m) +
        '月' +
        zeroize(d) +
        '日 ' +
        zeroize(H) +
        ':' +
        zeroize(i)
      )
    }
  }
}

const Articles = ({ data = [], getArticles, loading = [] }) => {
  const [postData, setPostData] = useState({
    category: categorys[0].value,
    order: orders[0].value,
    offset: 0,
    limit: 30
  })
  const listRef = React.createRef()

  const handleScroll = e => {
    let canScrollHeight = e.target.scrollHeight - e.target.offsetHeight
    // 距离底部100px是加载数据
    if (e.target.scrollTop >= canScrollHeight - 100) {
      const newPostData = {
        ...postData,
        offset: postData.offset + 1
      }
      setPostData(newPostData)
      getArticles(newPostData)
    }
  }

  const handleChangeFilter = newPostData => {
    if (listRef.current) {
      listRef.current.scrollTop = 0
    }
    setPostData(newPostData)
    getArticles(newPostData)
  }

  return (
    <Row
      type="flex"
      className={styles.root}
      style={{ flexDirection: 'column' }}
    >
      <Col className={styles.header}>
        <div className={styles.headerLeft}>
          <img
            className={styles.img}
            src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KPCEtLSBDcmVhdG9yOiBDb3JlbERSQVcgWDcgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iOC4zODU3bW0iIGhlaWdodD0iOC4xOTIzbW0iIHZlcnNpb249IjEuMSIgc3R5bGU9InNoYXBlLXJlbmRlcmluZzpnZW9tZXRyaWNQcmVjaXNpb247IHRleHQtcmVuZGVyaW5nOmdlb21ldHJpY1ByZWNpc2lvbjsgaW1hZ2UtcmVuZGVyaW5nOm9wdGltaXplUXVhbGl0eTsgZmlsbC1ydWxlOmV2ZW5vZGQ7IGNsaXAtcnVsZTpldmVub2RkIgp2aWV3Qm94PSIwIDAgNTA5IDQ5NyIKIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KIDxkZWZzPgogIDxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+CiAgIDwhW0NEQVRBWwogICAgLmZpbDAge2ZpbGw6IzAwNkNGRn0KICAgIC5maWwxIHtmaWxsOndoaXRlfQogICBdXT4KICA8L3N0eWxlPgogPC9kZWZzPgogPGcgaWQ9IuWbvuWxgl94MDAyMF8xIj4KICA8bWV0YWRhdGEgaWQ9IkNvcmVsQ29ycElEXzBDb3JlbC1MYXllciIvPgogIDxyZWN0IGNsYXNzPSJmaWwwIiB3aWR0aD0iNTA5IiBoZWlnaHQ9IjQ5NyIvPgogIDxwYXRoIGlkPSJGaWxsLTEtQ29weSIgY2xhc3M9ImZpbDEiIGQ9Ik0yODUgMTM4bC0zMSAtMjQgLTMzIDI1IC0yIDIgMzUgMjcgMzQgLTI3IC0zIC0zem0xMTkgOTVsLTE1MCAxMTYgLTE1MSAtMTE2IC0yMiAxNyAxNzMgMTM0IDE3MyAtMTM0IC0yMyAtMTd6bS0xNTAgOWwtODIgLTYzIC0yMyAxNyAxMDUgODEgMTA0IC04MSAtMjIgLTE3IC04MiA2M3oiLz4KIDwvZz4KPC9zdmc+Cg=="
          />
          <div className={styles.headerTitle}>掘金</div>
          <Select
            size="small"
            style={{ width: 100 }}
            value={postData.category}
            onChange={category => {
              const newPostData = {
                ...postData,
                offset: 0,
                category
              }
              handleChangeFilter(newPostData)
            }}
          >
            {categorys.map(item => (
              <Option key={item.value} value={item.value}>
                {item.label}
              </Option>
            ))}
          </Select>
        </div>
        <div className={styles.headerRight}>
          {orders.map(item => (
            <div
              className={classnames(styles.rItem, {
                [styles.active]: postData.order === item.value
              })}
              key={item.value}
              onClick={() => {
                const newPostData = {
                  ...postData,
                  offset: 0,
                  order: item.value
                }
                handleChangeFilter(newPostData)
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      </Col>
      <Col className={styles.listCol}>
        <div
          className={styles.list}
          ref={listRef}
          onScroll={throttle(handleScroll)}
        >
          <List
            itemLayout="horizontal"
            dataSource={data}
            loading={loading.includes('getArticles')}
            renderItem={item => (
              <List.Item className={styles.listItem}>
                <div className={styles.badge}>
                  <Icon type="caret-up" />
                  <span>{item.collectionCount}</span>
                </div>
                <div className={styles.cont}>
                  <div className={styles.title}>{item.title}</div>
                  <div className={styles.itemFoot}>
                    <span style={{ marginRight: 16 }}>
                      {formatMsgTime(item.date.iso)}
                    </span>
                    <span>{item.user.username}</span>
                  </div>
                </div>
              </List.Item>
            )}
          />
        </div>
      </Col>
    </Row>
  )
}

export default Articles
