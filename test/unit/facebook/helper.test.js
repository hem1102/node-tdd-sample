import FacebookHelper from '../../../src/facebook/helper.js'
import task1_initModel from '../../../src/database/task1'

describe.only('facebook-helper', () => {
  let facebookHelper = null;

  before((done) => {
    let userId = "840767969346417";
    let token = "EAACEdEose0cBAHAu5ZAktHr3tu6m1dKIzrHYD8rRB6I3MK1lfwZBERwzlvbsJIFZC2eaZB30z5QAk0J7fc1jU2eTpDefNlZBFA0VnawMNJ8jmitkffp9ZAZC3byTo5C8BQAkIDwT9w4vNIGxA7BZCngGi6gKbJfz3Vj4dxrsELEHZAAZDZD";
    facebookHelper = new FacebookHelper({userId, token});
    //console.log(facebookHelper);
    done();
  });
  /****************************/
  //1.透過 sequelize 設置 friend model : name,facebookId,email (model define)
  let models = null;
  let testuser = null;
  before(async (done) => {
    try {
      models = await task1_initModel();

      const testUser = {
        name: 'test',
        email: 'test@mail.com'
      }
      testuser = await models.Friend.create(testUser);

      done();
    } catch (e) {
      done(e);
    }
  });
  /****************************/
  //2.把從 facebook 取得的 friends list存入sequelize之friend model (create)
  it("2.把從 facebook 取得的 friends list存入sequelize之friend model (create)", async (done) => {
    try {
      let friends = await facebookHelper.getFriends();
      //console.log("friends", friends);

      await models.Friend.bulkCreate(friends);

      let list = await models.Friend.findAll();

      list.length.should.not.be.eq(0);
      list.length.should.not.be.eq(1);
      console.log('friend list.length = ', list.length);

      done();
    } catch (e) {
      done(e);
    }
  });
  /****************************/
  //3.原本用 api 取得的 friends list 改為夠過查詢資料庫的方式 (find)
  it("3.原本用 api 取得的 friends list 改為夠過查詢資料庫的方式 (find)", async(done) => {
    try {

      let result = await models.Friend.findOne({
        where: {
          name: testuser.name,
        },
      });

      result.email.should.be.eq(testuser.email);

      done();
    } catch (e) {
      done(e);
    }
  });
  /****************************/
  //4.將其中一個 friend 更新其email欄位為hellojs@trunk.studio (update)
  it("4.將其中一個 friend 更新其email欄位為hellojs@trunk.studio (update)", async(done) => {
    try {

      let findTarget = await models.Friend.findOne({
        where: {
          name: testuser.name,
        },
      });
      findTarget.email = 'hellojs@trunk.studio';
      await findTarget.save();

      let result = await models.Friend.findOne({
        where: {
          name: testuser.name,
        },
      });
      result.email.should.not.be.eq(testuser.email);
      result.email.should.be.eq('hellojs@trunk.studio');

      done();
    } catch (e) {
      done(e);
    }

  });
  /****************************/
  //5.刪除該欄位 friend (delete)
  it("5.刪除該欄位 friend (delete)", async(done) => {
    try {

      let result = await models.Friend.findOne({
        where: {
          email: 'hellojs@trunk.studio',
        },
      });
      await result.destroy();

      const check = await models.Friend.findOne({
        where: {
          email: 'hellojs@trunk.studio',
        },
      });
      (check === null).should.be.true;

      const check2 = await models.Friend.findOne({
        where: {
          name: testuser.name,
        },
      });
      (check === null).should.be.true;

      done();
    } catch (e) {
      done(e);
    }
  });

  /****************************
  it("get friends list", async (done) => {
    try {
      let friends = await facebookHelper.getFriends();
      //console.log("friends", friends);
      (friends != null).should.be.true;
      friends.should.be.Array;
      friends[0].should.have.keys("name", "id");
      done();
    } catch (e) {
      done(e);
    }
  });

  it.skip("publish post", async (done) => {
    try {
      let post = {
        message: 'test facebook post api'
      }
      let result = await facebookHelper.publishPost(post);
      console.log("result", result);
      done();
    } catch (e) {
      done(e);
    }
  });
  /****************************/

});
