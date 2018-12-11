**Trojan.Ransom.CryptoJoker**



최근 CrpytoJoker 랜섬웨어의 변종으로 CryptoNar로 불리는 랜섬웨어가 발견되었습니다. CryptoJoker 랜섬웨어와는 다르게 암호화 대상이나 방법에는 차이점을 보입니다. CryptoNar 랜섬웨어는 암호화 제외 확장자를 따로 구분하지 않아 바탕 화면에 존재하는 모든 폴더와 파일이 암호화 대상이 됩니다. 파일 암호화가 완료되면, 시스템 정보와 RSA키 정보를 공격자 메일로 전송합니다. 현재 복호화 도구가 공개되어 피해를 최소화할 수 있으나, 지속적인 변종이 등장할 가능성이 높은 만큼 사용자의 주의가 필요합니다. 



따라서, 본 보고서에서는 CryptoNar 랜섬웨어를 상세 분석하고자 합니다. 





**악성코드 상세 분석**



\1. 중복 실행 방지

중복 실행을 방지하기 위해 특정 폴더 내에 ‘jokingwithyou.cryptoNar’ 파일 유무를 검사합니다. 파일 존재하지 않으면 암호화가 진행되지 않은 시스템으로 인지하고 악성 행위를 계속합니다. 

  

![](https://t1.daumcdn.net/cfile/tistory/993B7F345B9B972632)

​									[그림 1] 중복 실행 방지 코드





\2. 파일 암호화

CryptoNar랜섬웨어는 파일을 암호화할 때, 확장자에 따라 암호화 방법이 상이합니다. 파일 확장자가 ‘.txt’, ‘.md’일 경우에는 데이터 전체를 암호화 하고 ‘.fully.cryptoNar’ 확장자를 추가합니다. 그 외 확장자를 가진 파일은 데이터의 첫 1024바이트만 암호화하고 ‘.partially.cryptoNar' 확장자를 추가합니다. 

![](https://t1.daumcdn.net/cfile/tistory/992BE5365B9B972612)

 										[그림 2] 확장자 구분 코드



기존 CryptoJoker 랜섬웨어와는 다르게 확장자 구분없이 모든 파일을 암호화합니다. 다음은 암호화가 끝난 후 확장자가 추가된 화면입니다. 해당 파일들은 더 이상 정상 파일로 동작하지 않습니다. 

![](https://t1.daumcdn.net/cfile/tistory/998048495B9B972609)

​									[그림 3] 암호화된 파일 화면



2.1파일 암호화 알고리즘

파일 암호화는 간단한 바이트 덧셈 연산으로 이뤄집니다. 암호화할 원본 데이터와 임의로 생성한 20바이트 문자열 

(ex: 8V2ZQCT2Q8MGLX5PQEIH)의 첫 1바이트를 더하여 암호화 데이터를 생성합다. 첫 1바이트는 파일 암호화에 사용되는 EncryptionKey로 본 악성코드에서는 0x38(‘8’)가 사용되었습니다. 



암호화 데이터 = 원본 데이터 + EncryptionKey [(0x38(‘8’)]



다음과 같이 ‘.partially.cryptoNar’로 암호화된 파일의 데이터가 첫 1024바이트(0x400)까지 암호화된 것을 확인할 수 있습니다. 각 바이트 값들이 덧셈 연산에 의해 0x38씩 증가했습니다.

![](https://t1.daumcdn.net/cfile/tistory/99BC1C4A5B9B97260B)

​									[그림 4] 부분 암호화된 데이터

  

\3. 랜섬노트 생성

파일 암호화가 완료되면, 사용자에게 감염 사실과 복호화 방법을 안내하기 위한 랜섬노트가 ‘CRYPTONAR RECOVERY INFORMATION.txt’ 이름으로 바탕화면에 생성됩니다. 공격자는 복호화 키를 구매하기 위해 72시간 이내로 $200의 비트코인을 지불해야 한다고 지시합니다. 

  

비트코인 주소: 1FeutvrVeiF8Qdnnx9Rr3CyBfHBCFeKWPq

  

![](https://t1.daumcdn.net/cfile/tistory/99EB5A4E5B9B972603)

 					[그림 5] CRYPTONAR RECOVERY INFORMATION 랜섬노트

  

\4. SMTP 메일 전송 



또한, 파일 암호화 완료 후SMTP 프로토콜을 이용해 시스템 정보 및 RSA 키 정보를 공격자에게 전달합니다. 메일 전송은 ‘smtp.zoho.eu’ 호스트를 이용합니다. 

![](https://t1.daumcdn.net/cfile/tistory/9954F8485B9B972606)

[그림 6] SMTP 메일 전송 코드



다음은 메일 전송에 필요한 데이터 형식입니다. 메일 제목은 Hello이며 ‘johnstang@zoho.eu’로부터 ‘johnsmith987654@tutanota.com’으로 전송됩니다. Body 항목에 공격자가 원하는 정보가 저장되어 있다. 이 때, How are you로 전송되는 RSA 키 정보는 추후 드롭되는 ‘CryptoNarDecryptor.exe’ 프로그램에서 복호화 키로 사용됩니다. ‘CryptoNarDecryptor.exe’는 암호화된 파일을 복호화 하는 기능을 가진 프로그램으로 ‘2.5 파일 복호화’ 부분에서 더 자세한 내용을 확인할 수 있습니다.



Body

\- Hello: 사용자 식별을 위한 개인 고유 ID 

\- How are you: Base64로 인코딩 된 RSA 키 (RSA키는 파일 암호화에 사용되지 않습니다.)

![](https://t1.daumcdn.net/cfile/tistory/994C324C5B9B97260F)

[그림 7] SMTP 메일 전송 데이터 형식



네트워크 패킷을 통해 메일이 정상적으로 암호화되어 전달된 것을 알 수 있습니다. 



220: 도메인 서비스가 준비되었음을 알리는 응답 코드

250: 요청한 메일을 정상적으로 전달하였음을 알리는 응답 코드

![](https://t1.daumcdn.net/cfile/tistory/995A3E475B9B972605)

​								[그림 8] SMTP 메일 네트워크 패킷





\5. 파일 복호화 프로그램

공격자는 파일 복호화 프로그램으로 ‘CrytoNarDecryptor.exe’ 파일을 바탕화면에 생성 후 실행합니다. 이 파일은 CryptoNar 랜섬웨어 리소스 영역에 저장되어 있습니다. 해당 파일은 다음과 같이 크롬 아이콘을 사용합니다.

![](https://t1.daumcdn.net/cfile/tistory/990A124F5B9B972614)

​							[그림 9] ‘CrytoNarDecryptor.exe’파일 생성

  

시스템 재부팅 시에도 자동 실행될 수 있도록 레지스트리(HKCU\Software\Microsoft\Windows\CurrentVersion\Run) 에 ‘Sound Card’ 이름으로 키 값을 등록합니다.

  

![](https://t1.daumcdn.net/cfile/tistory/99B737365B9B972605)

​						[그림 10] ‘Sound Card’이름으로 자동 실행 등록

  

다음은 ‘CrytoNarDecryptor.exe’ 실행 화면입니다. 복호화 방법과 개인 고유 ID, 비트코인 주소를 확인할 수 있고, RSA키 를 적용하여 파일을 복원할 수 있는 기능이 포함되어 있습니다.

  

![](https://t1.daumcdn.net/cfile/tistory/991FD53E5B9B972636)

​							[그림 11] ‘CrytoNarDecryptor.exe’ 실행 화면

  

다음은 복호화 키를 입력할 수 있는 화면입니다. 이 복호화 키는 Base64형태로 인코딩 된 RSA키 이며, 공격자에게 메일로 전송한 키입니다.

![](https://t1.daumcdn.net/cfile/tistory/99C68A4F5B9B97261A)

​									[그림 12] RSA 키를 입력하는 화면

  

다음과 같은 코드를 통해 유효한 RSA 키가 입력되었는지 확인합니다. 만약에 이 RSA 키가 유효한 경우에는 암호화된 파일을 복호화 할 수 있습니다. 

![](https://t1.daumcdn.net/cfile/tistory/99C3C9425B9B972629)

​										[그림 13] RSA 키 유효성 검사



다음은 유효한 RSA키가 적용되었을 때 복호화를 시작하는 화면입니다. 

​										 ![](https://t1.daumcdn.net/cfile/tistory/994BEA4C5B9B97260F)

​									[그림 14] 복호화 시작 안내 화면

 

다음은 파일 복호화 알고리즘이다. 암호화에 사용되었던 EncryptionKey를 빼주면 원본 데이터를 얻을 수 있습니다. 



암호화 데이터 = 원본 데이터 - EncryptionKey [0x38(‘8’)]



정상적으로 복원된 파일은 다음과 같습니다. 

![](https://t1.daumcdn.net/cfile/tistory/997E4F505B9B972627)

​							[그림 15] 정상적으로 복원된 파일 화면

  

  

**결론**



CrpytoNar 랜섬웨어의 암호화 방법은 다른 랜섬웨어에 비해 비교적 간단한 바이트 덧셈 연산을 이용합니다. 그렇기 때문에 복호화 방법 역시 간단하고, EncryptionKey를 알면 암호화된 모든 파일을 복호화 할 수 있습니다. 이때, 원본 파일을 가지고 있다면 암호화된 파일과 비교를 통해서 EncryptionKey를 쉽게 알아낼 수 있습니다. 



마찬가지로, RSA 키를 알고 있는 경우 ‘CryptoNarDecryptor.exe’ 프로그램을 통해서, 공격자에게 비용을 지불하지 않고도 암호화된파일을 복원할 수 있습니다.



또한, 중복 실행 방지를 위해 생성되는 ‘jokingwithyou.cryptoNar’ 파일을 %AppData% 하위에 미리 생성해 두면 CrpytoNar 랜섬웨어에 감염되는 것을 예방할 수 있습니다.  



사용자들은 랜섬웨어를 예방하기 위해 중요 파일은 주기적으로 백업하는 습관을 들여야 합니다. 또한 패치 누락으로 인한 취약점이 발생하지 않도록 운영체제와 소프트웨어는 최신 버전을 유지하는 것이 중요합니다. 



현재 알약에서는 **‘Trojan.Ransom.CryptoJoker’**로 진단하고 있습니다. 



출처:https://www.estsecurity.com/securityCenter/malwareReport/1?