import React, { Component } from 'react'
import { PullToRefresh } from 'antd-mobile'
import throttle from 'lodash/throttle'

type Props = {
  onScroll?: (scrollTop: number) => undefined // 滚动中
  onScrollStart?: (scrollTop: number) => undefined // 滚动开始
  onScrollEnd?: (scrollTop: number) => undefined // 滚动结束
  onRefresh?: Function // 如果设置了此选项，则会在列表头部添加一个标准的RefreshControl控件，以便实现“下拉刷新”的功能
  onEndReached?: Function // 当列表被滚动到距离内容最底部不足onEndReachedThreshold的距离时调用
  onEndReachedThreshold?: number // 决定当距离内容最底部还有多远时触发onEndReached回调。注意此参数是一个比值而非像素单位。比如，0.5 表示距离内容最底部的距离为当前列表可见长度的一半时触发。
  refreshing?: boolean // 下拉刷新时，在等待加载新数据时将此属性设为 true，列表就会显示出一个正在加载的Icon。
}

type State = {
  refreshing: boolean // 刷新状态 如果props中有就用props中的
  down: boolean // 控制方向和显示指示器
}

class ScrollView extends Component<Props, State> {
  static defaultProps = {
    onEndReachedThreshold: 0.5,
  }

  scrolling: boolean = false
  scrollEndTimer: any = null
  refreshingTimer: any = null
  constructor(props: Props) {
    super(props)
    this.state = {
      refreshing: false,
      down: true,
    }
  }

  componentDidMount() {
    this.init()
  }

  componentWillMount() {
    if (this.scrollEndTimer) {
      clearTimeout(this.scrollEndTimer)
    }
    if (this.refreshingTimer) {
      clearTimeout(this.refreshingTimer)
    }
    window.removeEventListener('scroll', this.handleScroll)
  }

  init() {
    window.addEventListener('scroll', this.handleScroll)
  }

  handleScroll = (ele: Event) => {
    const scrollTop =
      document.documentElement.scrollTop ||
      window.pageYOffset ||
      document.body.scrollTop
    if (scrollTop || scrollTop === 0) {
      const {
        onScrollStart,
        onScroll,
        onScrollEnd,
        onEndReachedThreshold,
      } = this.props
      if (!this.scrolling) {
        this.scrolling = true
        onScrollStart && onScrollStart(scrollTop)
      }
      onScroll && onScroll(scrollTop)
      // 下拉刷新条件判断
      const clientHeight = window.innerHeight
      const scrollHeight =
        document.documentElement.scrollHeight > clientHeight
          ? document.documentElement.scrollHeight
          : document.body.scrollHeight
      if (
        scrollTop + clientHeight + onEndReachedThreshold! * clientHeight >
        scrollHeight
      ) {
        this.handleEndReached()
      }
      // 模拟scrollEnd触发条件
      clearTimeout(this.scrollEndTimer)
      this.scrollEndTimer = setTimeout(() => {
        if (this.scrolling) {
          onScrollEnd && onScrollEnd(scrollTop)
          this.scrolling = false
        }
      }, 300)
    }
  }

  handleEndReached = throttle(() => {
    this.props.onEndReached && this.props.onEndReached()
  }, 200)

  handleRefresh = () => {
    this.props.onRefresh && this.props.onRefresh()
    if (this.props.refreshing === undefined) {
      this.setState({ refreshing: true })
      this.refreshingTimer = setTimeout(() => {
        this.setState({ refreshing: false })
      }, 1000)
    }
  }

  render() {
    const { children, refreshing } = this.props
    return (
      <PullToRefresh
        damping={60}
        style={{
          minHeight: '100%',
          overflow: 'auto',
        }}
        indicator={this.state.down ? {} : { deactivate: '上拉可以刷新' }}
        direction={this.state.down ? 'down' : 'up'}
        refreshing={
          refreshing !== undefined ? refreshing : this.state.refreshing
        }
        onRefresh={this.handleRefresh}
        getScrollContainer={() => document.body}
        distanceToRefresh={25}
      >
        {children}
      </PullToRefresh>
    )
  }
}

export default ScrollView
