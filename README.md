## Blockchain for Open Threat Intelligence

This is for team 9200
Developing DPoS based Open Threat Intelligence

# done
- block definition
- mining (proof of work)
- search in Block


# to do

## consensus algorithm (☆☆☆☆☆)
- more specific malwares information, transaction definition
- transaction validation check function
    - transaction search method
- block validation check function
- chain validation check function
- send chain length

## tools to be done
- public key sign, validation module
- wrtieChain need to be fixed (appending should be possible)
- lastBlock sending function
- lastBlock appending function
- 순서 정하는 알고리즘 
- 랜덤한 숫자 하나씩 보내기

## additional needs
- wallet
- voting



# problems
- readChain 의 효율성 문제
  - 항상 풀체인을 읽을 필요 없이 문제되는 부분만을 선택해서 읽으면 좋지않을까? (대부분 끝부분일듯)
  - 모든 체인을 처음부터 끝까지 읽기에는 fork가 일어날때 문제가 생길 여지가 다분함

- transaction 구조체 변경
  - 코인 송금자의 sign이 들어가야함. <- 공개키 모듈 필요

- malwaresInfo 의 구조체를 더 명확하게 할 필요가 있음 (재정의 할 필요 있음)

- nodeURL 을 블록체인이 담고 있어야하는가? // 마이너들을 알 필요가 있는가??
