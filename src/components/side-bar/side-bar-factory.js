import ArticleSideBar from './article-side-bar.js'
import IndexPageSideBar from './index-page-side-bar'
import SideBarHOC from '@twreporter/react-components/lib/side-bar'

function getIndexPageSideBar() {
  return SideBarHOC(IndexPageSideBar)
}

function getArticleSideBar() {
  return SideBarHOC(ArticleSideBar)
}

export default {
  getIndexPageSideBar,
  getArticleSideBar
}
