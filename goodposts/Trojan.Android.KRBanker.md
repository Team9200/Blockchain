**Trojan.Android.KRBanker**

  

스미싱과 보이스피싱 등을 결합한 형태로 악성 앱들이 유포되고 있습니다. 해당 앱들은 주로 1 금융 관련 앱을 사칭하였으나 최근에는 국가기관, 금융 사칭 등으로 다양한 형태로 나타나고 있습니다. 기기 및 개인정보를 탈취하고 금융 정보 탈취를 목적으로 기기의 통화 상태를 감시합니다.

  

특히, 해당 앱은 분석을 어렵게 하기 위해서 중국 Qihoo 360사의 패킹 기술을 적용하였습니다.

   

본 분석 보고서에서는 “Trojan.Android.KRBanker”를 상세 분석하고자 합니다.

  

**악성코드 상세 분석**

  

\1. 패킹 특징  

  

중국 Qihoo 360사의 패킹 된 앱은 일반 앱과는 다른 부분이 존재합니다. 앱의 권한과 컴포넌트 관련 정보를 볼 수 있는 매니페스트를 보면 일반 안드로이드 앱에서는 볼 수 없는 항목인 “android:qihoo”부분이 추가되어 있는데 이는 디컴파일을 방해합니다. “assets” 폴더에는 파일의 무결성과 동적 패킹에 관여하는 “.appkey”, “libjiagu.so” 파일이 포함되어 있습니다. 또한, 아래 [그림 2]를 보면 패키지명이 “com.android.hellod3”이지만, 패킹 된 덱스 코드에서는 해당 부분을 찾을 수 없어 정적 분석으로는 실제 악성 행위와 관련된 코드를 볼 수 없습니다.

  

![](https://t1.daumcdn.net/cfile/tistory/99C66C3E5BF4F19015)

![](https://t1.daumcdn.net/cfile/tistory/9986B84B5BF4F19009)

​									[그림 1] 패킹 된 앱의 구조

![](https://t1.daumcdn.net/cfile/tistory/99264D355BF4F27D26)

​									[그림 2] 패킹 전 후 덱스코드 비교

  

\2. 안티 디컴파일러

  

앱 디컴파일에 흔히 쓰이는 “apktool” 최신 버전을 통해서 컴파일을 시도하면 매니페스트의 “qihoo”와 관련된 요소를 찾을 수 없다고 하여 에러를 일으킨다. 앱의 동적 분석을 위해서는 매니페스트에 android:debuggable="true" 항목이 필요한데 이를 방지한다.

![](https://t1.daumcdn.net/cfile/tistory/995692355BF4F19008)

​										[그림 3] 컴파일 실패



\3. 안티 디버깅

  

패킹 앱의 초기에는 안티 디버깅이 포함되어 있지 않아서 메모리에 로드된 덱스 파일을 실시간 덤프를 함으로써 간단히 패킹앱의 분석이 가능했습니다. 그러나 최근 패킹 앱에는 다양한 안티 디버깅 기법이 추가되었기 때문에 동적 분석을 통해서 안티 디버깅을 우회한 다음에서야 메모리에 로드된 덱스 파일 덤프가 가능합니다.

  

3.1 dlactivity 확인

“/system/linker” 모듈 내부에 존재하는 “dl_rtld_db_dlactivity”의 값은 디버깅 되고 있는지 없는지를 나타냅니다.

![](https://t1.daumcdn.net/cfile/tistory/994E27335BF4F19019)

​								[그림 4] dlactivity 활용 안티 디버깅

  

3.2 TracerPid 확인

“/proc/self/status” 파일을 확인해보면 앱과 관련된 정보들이 나타나있습니다. 그 중에서 “TracerPid”의 값을 통해서 디버깅 여부를 확인할 수 있습니다.

![](https://t1.daumcdn.net/cfile/tistory/99E9DB3A5BF4F19018)

​										 ![](https://t1.daumcdn.net/cfile/tistory/993AB4385BF4F19018)

![](https://t1.daumcdn.net/cfile/tistory/99E207425BF4F19014)

​								[그림 5] TracerPid 활용 안티 디버깅

  

3.3 주소 활성화 여부 확인

주소와 포트를 확인하여 디버깅 여부를 확인합니다. IDA를 통해서 안드로이드 원격 디버깅이 가능한데, IDA의 기본 디버깅 주소와 포트의 활성화 여부를 확인하여 디버깅 여부를 확인합니다.

​										 ![](https://t1.daumcdn.net/cfile/tistory/99A744405BF4F19001)

​											![](https://t1.daumcdn.net/cfile/tistory/9982743A5BF4F1901C)

![](https://t1.daumcdn.net/cfile/tistory/99E4AB4E5BF4F1900D)

![](https://t1.daumcdn.net/cfile/tistory/9901853A5BF4F19022)

​									[그림 6] 주소 확인을 통한 안티 디버깅

  

  

3.4 특정 문자 확인

“gdb”, “android_server” 등의 동적 디버깅에 사용되는 도구들의 명령어 및 메모리상의 관련 문자열 확인을 통해서 디버깅 여부를 확인합니다.

​									 ![](https://t1.daumcdn.net/cfile/tistory/99F03F3F5BF4F19017)

![](https://t1.daumcdn.net/cfile/tistory/995AFF375BF4F19016)

​						[그림 7] 명령어 및 메모리 확인을 통한 안티 디버깅

  

3.5 시간 확인

코드 실행 중간중간에 시간 관련 함수를 추가하여 해당 코드의 실행 시간을 계산하여 디버깅 여부를 확인합니다.

![](https://t1.daumcdn.net/cfile/tistory/99717B395BF4F19018)

​								[그림 8] 시간 확인을 통한 안티 디버깅

  

3.6 덱스 파일 덤프

안티 디버깅을 모두 우회하면 복호화된 덱스 파일은 “libart.so” 모듈에 의해서 메모리로 로드되는데, 이때 덱스 파일이 로드된 메모리 주소와 덱스 파일 구조에 기록되어 있는 덱스 파일의 크기를 계산하여 해당 부분을 덤프합니다. 다음 실제 코드가 담긴 덱스코드를 분석합니다.

![](https://t1.daumcdn.net/cfile/tistory/993EA33C5BF4F1900D)

![](https://t1.daumcdn.net/cfile/tistory/99AAB34D5BF4F1901B)

![](https://t1.daumcdn.net/cfile/tistory/9959773D5BF4F1902B)

​									[그림 9] 덱스 파일 덤프

  

\4. 덱스 파일 분석

  

“assets” 폴더에는 “image.zip” 파일이 있는데 내부에는 악성 행위에 사용되는 가짜 통화 관련 사진과 악성 앱을 구성하는 여러 개의 사진 등이 있습니다.

​		  ![](https://t1.daumcdn.net/cfile/tistory/999955365BF4F19019)

![](https://t1.daumcdn.net/cfile/tistory/99F8D8385BF4F1901B)

![](https://t1.daumcdn.net/cfile/tistory/990E2A355BF4F19024)

​								[그림 10] 악성 앱에 사용되는 파일

  

기기의 아이디와 전화번호를 탈취하여 식별 정보로 사용합니다.

  

![](https://t1.daumcdn.net/cfile/tistory/99F406385BF4F1911B)

​									[그림 11] 기기 정보 탈취

  

기기 부팅 시 서비스를 실행시켜 지속적인 악성 행위를 가능토록 합니다.

  

​				 ![](https://t1.daumcdn.net/cfile/tistory/99D8FF4C5BF4F19113)

​									[그림 12] 기기 부팅 시 재실행

  

 안드로이드 정책에서는 일정 시간 동안 와이파이를 사용하지 않으면 꺼지게 되는데 이를 방지하여 C&C와의 지속적인 통신을 가능토록 합니다.

  

![](https://t1.daumcdn.net/cfile/tistory/991B804B5BF4F19118)

​									[그림 13] 지속적인 와이파이 연결

  

메시지를 주기적으로 감시하고 탈취하여 C&C 서버로 전송합니다.

   	![](https://t1.daumcdn.net/cfile/tistory/99927A475BF4F19111)

​										[그림 14] 메시지 탈취



주소록을 주기적으로 감시하고 탈취하여 C&C 서버로 전송합니다.

  

​	 ![](https://t1.daumcdn.net/cfile/tistory/99C36E4F5BF4F19116)



  										[그림 15] 주소록 탈취

  

통화 상태를 확인하고 특정 번호를 감시하여 해커에게 연결되도록 하고 사용자를 속이기 위해서 가짜 통화 사진을 팝업합니다.

  

![](https://t1.daumcdn.net/cfile/tistory/99FD6F475BF4F19121)

​										[그림 16] 통화 탈취



C&C 서버는 “lib” 폴더의 “libmasker.so” 파일 내부의 함수 호출을 통해서 불러옵니다.

![](https://t1.daumcdn.net/cfile/tistory/998FD04E5BF4F19119)

![](https://t1.daumcdn.net/cfile/tistory/99C5823B5BF4F19118)

​										[그림 17] C&C 서버



**결론**



해당 악성 앱은 금융권 앱의 아이콘과 이름을 사칭합니다. 사용자의 기기 및 개인정보를 탈취하고 전화 상태를 확인하여 특정번호를 감시합니다. 통화를 종료하고 해커에게 전화를 자동으로 걸도록 하여 금융 정보를 탈취합니다. 특히, 앱의 분석을 어렵게 하기 위해서 중국의 Qihoo 360의 패킹을 적용했습니다.



따라서, 악성 앱으로부터 피해를 최소화하기 위해서는 백신 앱을 통한 주기적인 검사가 중요합니다. 출처가 불명확한 URL과 파일은 실행하지 않는 것이 기본이고 공식 마켓인 구글 플레이스토어를 통해서 확보한 앱이라도 백신 앱을 추가 설치하여 주기적으로 업데이트하고 검사해야 합니다.



현재 알약 M에서는 해당 앱을 **‘Trojan.Android.KRBanker’** 탐지 명으로 진단하고 있습니다.







출처 : https://www.estsecurity.com/securityCenter/malwareReport/1?