const { assert } = require('chai')
const { default: Web3 } = require('web3')

const SocialNetwork = artifacts.require('./SocialNetwork.sol')

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('SocialNetwork', ([deployer, author, tipper]) => {
    let socialNetwork 

    before(async () => {
        socialNetwork = await SocialNetwork.deployed()
    })

    describe('deployment', async () => {
        it('deploys succss', async () => {
            const address = await socialNetwork.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })

        it('has a name', async () => {
            const name = await socialNetwork.name()
            assert.equal(name, 'Sharif')
        })
    })

    describe('posts', async () => {
        let result, postCount

        before(async () => {
            result = await socialNetwork.createPost('my new note to myself!', { from: author })
            postCount = await socialNetwork.postCount()
        })

        it('create posts', async () => {
            assert.equal(postCount, 1)
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), postCount.toNumber())
            assert.equal(event.content, 'my new note to myself!')


            await socialNetwork.createPost('', { from: author}).should.be.rejected;
        })

        it('lists posts', async () => {
            const post = await socialNetwork.posts(postCount)
            assert.equal(post.content, 'my new note to myself!')
        })

        /**
        it('allow users to tip posts', async () => {
            let oldAuthorBalance
            oldAuthorBalance = await web3.eth.getBalance(author)
            oldAuthorBalance = await web3.utils.BN(oldAuthorBalance)

            result = await socialNetwork.tipPost(postCount, { from: tipper, value: web3.utils.toWei('1', 'Ether') })
            const event = result.logs[0].args
            //assert.equal(event.tipAmount, '1000000000000000000')

            let newAuthorBalance
            newAuthorBalance = await web3.eth.getBalance(author)
            newAuthorBalance = await web3.utils.BN(newAuthorBalance)

            let tipAmount
            tipAmount = web3.utils.toWei('1', 'Ether')
            tipAmount = new web3.utils.BN(tipAmount)

            const expectedBalance = oldAuthorBalance.add(tipAmount)
            //assert.equal(newAuthorBalance.toString(), expectedBalance.toString())

            //await socialNetwork.tipPost(99, { from: tipper, value: web3.utils.toWei(1, 'Ether')}).should.be.rejected;
        })
         */
    })
})