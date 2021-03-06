## ls

1. FP
2. nestjs 是 node 版本的 spring
3. nestjs ioc 的实现原理
4. 手写 express + nodejs
5. NGINX redis mysql
6. cli
7. 架构研究
8. ssm 连接池
9. 减少 nest 循环依赖注入深坑

## 配置

- service 中不要写 try catch 否则异常捕获不到 \*

MySQL 5.6-pass:abc123456 uV,0ejdn&.c#

## 2 restful

rest 是一种设计风格他不是一种标准 也不是一种软件 而是一种思想 res
rest 通常基于使用 HTTP URI 和 XML JSON 以及 HTML 这些现有的的广泛的协议和标准

### 2.1 rest 架构 的主要原则

1. 网络上的所有事物都被抽象为资源
2. 每个资源都有一个唯一的资源标识符
3. 同一个资源具有多种表现形式 xml json
4. 对资源的各种操作都不会改变资源标识符
5. 所有的操作都是无状态的

### 2.2 资源操作

- http:example.com/users/
  - GET: 获取一个 xinyuan
  - POST: 创建一个资源
  - PUT: 修改一个资源的状态
  - DELETE: 删除一个资源

用 http 的方法作为对资源操作的方法幂等性

### 2.3 rest 接口设计 最佳实践

url 组成:

- --网路协议
- -- 服务器地址
- -- 接口名称
- --? 参数列表

URL 定义限定

- 不要使用大写的字母
- 使用- 代替下划线\_
- 参数列表应该被 encode 过

### 2.4 响应设计

content body 仅仅用来传输数据数据要定义为拿来就用的原则永爱描述数据或者请求的元数据放 header 中 例如`x-result-fileds`

```
错误

{
status： 200，
data:{
  name: 1214,
  age: isam2016
 }
}

正确
response Header： status 200
response Body {
   name: 1214,
  age: isam2016
}

```

## spring

spring 是一个 ioc(DI) 和 AOP 容器框架

1. 配置形式 xml
2. Bean 的配置方式： 全反射
   - ioc：控制反转（模式概念）
     - DI: 依赖注入（属性注入）的方式，(ioc 的实现方式)
     - 属性注入通过 setter 方法注入 Bean 的属性值或依赖的对象

- class: bean 的全类名 通过反射的方式在 IOC 容器中创建 Bean 所以 Bean 中需要无参数的容器
- id: bean 的名称
- spring 容器，在 spring IOC 容器读取 Bean 配置创建 Bean 之前 必须对他进行实例化 只有在容器实例化后 才可以从 IOC 容器里获取 Bean 实例并且使用
- ApplicationContext 在初始上下文时就实例化所有单例的 Bean

## AOP

需求 1-日志：在程序执行期间追踪正在发生的活动

需求 2-验证：希望计算器只能处理正数的运算

前奏问题

- 代码混乱-越来越多的非业务需求(日志和验证等)加入后, 原有的业务方法急剧膨胀. 每个方法在处理核心逻辑的同时还必须兼顾其他多个关注点.
- 代码分散-以日志需求为例, 只是为了满足这个单一需求, 就不得不在多个模块（方法）里多次重复相同的日志代码. 如果日志需求发生变化, 必须修改所有模块.

代理设计模式的原理: 使用一个代理将对象包装起来, 然后用该代理对象取代原始对象. 任何对原始对象的调用都要通过代理. 代理对象决定是否以及何时将方法调用转到原始对象上.

[](./WX20191125-161318@2x.png)
[](./WX20191125-161318@2x.png)

- AOP: 面向切片编程 是一种新的方法论 是对传统 OOP 的补充
- AOP 的主要编程对象是切面， 而切面模块化横切 关注点
- 在应用 AOP 编程时候 仍然需要定义公共功能，但可以明确的定义这个功能在哪里，以什么方式应用，并且不修改受影响的类， 这样一来横切关注点就被模块化
- 到特殊的对象切面里
- AOP: 每个事物逻辑位于一个位置 代码不分散 便于升级和维护业务模块更简单

- 切面： 横切关注点 跨越应用程序多个模块的功能 被模块化的特殊对象
- 通知： 切面必须要完成的工作
- 目标： 被通知的对象
- 代理： 向目标对象应用通知之后创建的对象
- 连接点（Joinpoint）：程序执行的某个特定位置：如类某个方法调用前、调用后、方法抛出异常后等。连接点由两个信息确定：方法表示的程序执行点；相对点表示的方位。例如 ArithmethicCalculator#add() 方法执行前的连接点，执行点为 ArithmethicCalculator#add()； 方位为该方法执行前的位置
- 切点（pointcut）：每个类都拥有多个连接点：例如 ArithmethicCalculator 的所有方法实际上都是连接点，即连接点是程序类中客观存在的事务。AOP 通过切点定位到特定的连接点。类比：连接点相当于数据库中的记录，切点相当于查询条件。切点和连接点不是一对一的关系，一个切点匹配多个连接点，切点通过 org.springframework.aop.Pointcut 接口进行描述，它使用类和方法作为连接点的查询条件。

## spring AOP 实现的方式

- 1.引入包
- 2.在配置文件中加入 aop 的命名空间`<context:component-scan base-package="com.atguigu.spring.aop"></context:component-scan>`

- 3.基于注解的方式
  - a. 配置文件中加入如下的配置：`<aop:aspectj-autoproxy></aop:aspectj-autoproxy>`
  - b.把横切关注点的代码抽象到切面类中
    - i: 切面首先是一个 IOC 的 bean, 即加入 @Component 注解
    - ii: 切面还需加入@Aspect 注解
  - c. 在类中声明各种通知：
    - i:声明一个方法
    - ii: 在方法前加入@Before 注解
  - d. 可以在通知方法中声明一个类型为 JointPoint 的参数然后就能访问链接细节 入方法名称和参数值

## 模块

创建全局模块，全局模块不需要在注入到该模块，就能使用该模块导出的服务。
创建动态模块，动态模块可以创建可定制的模块，动态做依赖注入关系。

## dto

全称数据传输对象（DTO)(Data Transfer Object)，简单来说 DTO 是面向界面 UI，是通过 UI 的需求来定义的。通过 DTO 我们实现了控制器与数据验证转化解耦。

## docker-compose

1. docker-compose 常用命令

   docker-compose up [options][service...]

   `docker-compose up -d mysql`
   该命令十分强大，它将尝试自动完成包括构建镜像，（重新）创建服务，启动服务，并关联服务相关容器的一系列操作。
   链接的服务都将会被自动启动，除非已经处于运行状态。

docker-compose down
此命令将会停止 up 命令所启动的容器，并移除网络

docker-compose restart [options][service...]

```


  async findAll(query): Promise<ArticlesRO> {

    const qb = await getRepository(ArticleEntity)
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author');

    qb.where("1 = 1");

    if ('tag' in query) {
      qb.andWhere("article.tagList LIKE :tag", { tag: `%${query.tag}%` });
    }

    if ('author' in query) {
      const author = await this.userRepository.findOne({username: query.author});
      qb.andWhere("article.authorId = :id", { id: author.id });
    }

    if ('favorited' in query) {
      const author = await this.userRepository.findOne({username: query.favorited});
      const ids = author.favorites.map(el => el.id);
      qb.andWhere("article.authorId IN (:ids)", { ids });
    }

    qb.orderBy('article.created', 'DESC');

    const articlesCount = await qb.getCount();

    if ('limit' in query) {
      qb.limit(query.limit);
    }

    if ('offset' in query) {
      qb.offset(query.offset);
    }

    const articles = await qb.getMany();

    return {articles, articlesCount};
  }

  async findFeed(userId: number, query): Promise<ArticlesRO> {
    const _follows = await this.followsRepository.find( {followerId: userId});
    const ids = _follows.map(el => el.followingId);

    const qb = await getRepository(ArticleEntity)
      .createQueryBuilder('article')
      .where('article.authorId IN (:ids)', { ids });

    qb.orderBy('article.created', 'DESC');

    const articlesCount = await qb.getCount();

    if ('limit' in query) {
      qb.limit(query.limit);
    }

    if ('offset' in query) {
      qb.offset(query.offset);
    }

    const articles = await qb.getMany();

    return {articles, articlesCount};
  }

  async findOne(where): Promise<ArticleRO> {
    const article = await this.articleRepository.findOne(where);
    return {article};
  }

  async addComment(slug: string, commentData): Promise<ArticleRO> {
    let article = await this.articleRepository.findOne({slug});

    const comment = new Comment();
    comment.body = commentData.body;

    article.comments.push(comment);

    await this.commentRepository.save(comment);
    article = await this.articleRepository.save(article);
    return {article}
  }

  async deleteComment(slug: string, id: string): Promise<ArticleRO> {
    let article = await this.articleRepository.findOne({slug});

    const comment = await this.commentRepository.findOne(id);
    const deleteIndex = article.comments.findIndex(_comment => _comment.id === comment.id);

    if (deleteIndex >= 0) {
      const deleteComments = article.comments.splice(deleteIndex, 1);
      await this.commentRepository.delete(deleteComments[0].id);
      article =  await this.articleRepository.save(article);
      return {article};
    } else {
      return {article};
    }

  }

  async favorite(id: number, slug: string): Promise<ArticleRO> {
    let article = await this.articleRepository.findOne({slug});
    const user = await this.userRepository.findOne(id);

    const isNewFavorite = user.favorites.findIndex(_article => _article.id === article.id) < 0;
    if (isNewFavorite) {
      user.favorites.push(article);
      article.favoriteCount++;

      await this.userRepository.save(user);
      article = await this.articleRepository.save(article);
    }

    return {article};
  }

  async unFavorite(id: number, slug: string): Promise<ArticleRO> {
    let article = await this.articleRepository.findOne({slug});
    const user = await this.userRepository.findOne(id);

    const deleteIndex = user.favorites.findIndex(_article => _article.id === article.id);

    if (deleteIndex >= 0) {

      user.favorites.splice(deleteIndex, 1);
      article.favoriteCount--;

      await this.userRepository.save(user);
      article = await this.articleRepository.save(article);
    }

    return {article};
  }

  async findComments(slug: string): Promise<CommentsRO> {
    const article = await this.articleRepository.findOne({slug});
    return {comments: article.comments};
  }

  async create(userId: number, articleData: CreateArticleDto): Promise<ArticleEntity> {

    let article = new ArticleEntity();
    article.title = articleData.title;
    article.description = articleData.description;
    article.slug = this.slugify(articleData.title);
    article.tagList = articleData.tagList || [];
    article.comments = [];

    const newArticle = await this.articleRepository.save(article);

    const author = await this.userRepository.findOne({ where: { id: userId } });

    if (Array.isArray(author.articles)) {
      author.articles.push(article);
    } else {
      author.articles = [article];
    }

    await this.userRepository.save(author);

    return newArticle;

  }

  async update(slug: string, articleData: any): Promise<ArticleRO> {
    let toUpdate = await this.articleRepository.findOne({ slug: slug});
    let updated = Object.assign(toUpdate, articleData);
    const article = await this.articleRepository.save(updated);
    return {article};
  }

  async delete(slug: string): Promise<DeleteResult> {
    return await this.articleRepository.delete({ slug: slug});
  }

  slugify(title: string) {
    return slug(title, {lower: true}) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36)
  }
}
```