import styles from "./page.module.scss";
import HomeLatestTemplates from "../components/home/latest-templates";
import HomePopularTemplates from "../components/home/popular-templates";
import HomeTags from "../components/home/tags";

export default function Home() {
  return (
    <div className={styles.page}>
      <HomeTags></HomeTags>
      <HomeLatestTemplates></HomeLatestTemplates>
      <HomePopularTemplates></HomePopularTemplates>
    </div>
  );
}
